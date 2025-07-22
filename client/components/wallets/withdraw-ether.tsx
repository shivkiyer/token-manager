'use client';

import { useState, useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import { parseEther, Contract } from 'ethers';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

import { Wallet } from '@/interfaces/wallet';
import isErrorInForm from '@/utils/forms/isErrorInForm';

function WithdrawEther({ ethers, wallet }: { ethers: any; wallet: Wallet }) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);

  const fetchActiveAccount = useCallback(async () => {
    if (ethers !== null && ethers !== undefined) {
      const account = await ethers.getSigner();
      if (account?.address) {
        setActiveAccount(account?.address);
        setAccountError(null);
      } else {
        setAccountError('No linked Metamask account found');
      }
    }
  }, [ethers]);

  const verifyAccountAccess = useCallback(async () => {
    if (ethers !== null && ethers !== undefined) {
      await fetchActiveAccount();

      const userAccounts = wallet?.user?.map(
        (item: { id: number; address: string; name: string }) => item.address
      );
      if (activeAccount !== null && !userAccounts?.includes(activeAccount)) {
        setAccountError('Linked Metamask account is not a wallet user');
      }
    }
  }, [ethers, wallet, activeAccount, fetchActiveAccount]);

  useEffect(() => {
    setError(null);
    if (ethers === null || ethers === undefined) {
      setError('Metamask needs to be unlocked to manage the wallet');
      return;
    }

    verifyAccountAccess();
  }, [ethers, wallet, activeAccount, verifyAccountAccess]);

  const validateForm = () => {
    return Yup.object({
      amount: Yup.number()
        .required('Required')
        .positive('Withdrawal amount must be positive')
        .max(wallet.maxLimit)
        .typeError('Withdrawal amount must be a number'),
    });
  };

  const submitHandler = async (values: any, resetForm: () => void) => {
    setError(null);
    try {
      if (ethers === null || ethers === undefined) {
        setError('Metamask is locked or account is unavilable');
        return;
      }
      await verifyAccountAccess();
      const amountInWei = await parseEther(values.amount);
      const account = await ethers.getSigner();

      const contract = new Contract(wallet.address, wallet.abi, account);
      const estimateGas = await contract.withdraw.estimateGas(amountInWei);
      const actualGas = (estimateGas * BigInt(2)).toString();

      const result = await contract.withdraw(amountInWei, {
        gasLimit: actualGas,
      });
      await result.wait();

      if (!result.hash) {
        throw Object.assign(new Error());
      }
      setMessage('Funds withdrawn successfully. Check your Metamask account.');
      setError(null);
      resetForm();
    } catch (e) {
      setError('Could not withdraw funds');
      setMessage(null);
    }
  };

  const withdrawalForm = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema: validateForm,
    onSubmit: (values, { resetForm }) => submitHandler(values, resetForm),
  });

  const submitDisabled = () => {
    return isErrorInForm(withdrawalForm);
  };

  return (
    <form method='POST' onSubmit={withdrawalForm.handleSubmit}>
      <Grid container>
        {accountError && (
          <>
            <Grid size={{ xs: 12, md: 10 }} marginTop={1}>
              <Typography
                color='error'
                variant='body1'
                sx={{ textAlign: 'left' }}
              >
                {accountError}
              </Typography>
            </Grid>
            <Grid size={{ xs: 9, md: 7 }} paddingTop={0.5}>
              <Typography variant='body1'>
                Change the Metamask account and click on refresh
              </Typography>
            </Grid>
            <Grid size={{ xs: 3, md: 3 }}>
              <Button sx={{ padding: '0px' }} onClick={verifyAccountAccess}>
                <RefreshIcon />
              </Button>
            </Grid>
          </>
        )}
        {!accountError && (
          <>
            <Grid size={12} marginTop={3}>
              <TextField
                name='amount'
                label='Amount in Ether'
                variant='standard'
                value={withdrawalForm.values.amount}
                onChange={withdrawalForm.handleChange}
                onBlur={withdrawalForm.handleBlur}
                fullWidth
              ></TextField>
            </Grid>
            <Grid size={12} marginTop={1}>
              <Button
                variant='contained'
                type='submit'
                disabled={submitDisabled()}
                sx={{ marginRight: '12px' }}
              >
                <Typography variant='button'>Submit</Typography>
              </Button>
              {withdrawalForm.touched.amount &&
                withdrawalForm.errors.amount && (
                  <Typography
                    color='error'
                    variant='body1'
                    sx={{ textAlign: 'left', display: 'inline' }}
                  >
                    {withdrawalForm.errors.amount.toString()}
                  </Typography>
                )}
            </Grid>

            {error && (
              <Grid size={12} marginTop={1}>
                <Typography
                  color='error'
                  variant='body1'
                  sx={{ textAlign: 'left' }}
                >
                  {error}
                </Typography>
              </Grid>
            )}

            {message && (
              <Grid size={12} marginTop={1}>
                <Typography variant='body1' sx={{ textAlign: 'left' }}>
                  {message}
                </Typography>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </form>
  );
}

export default WithdrawEther;

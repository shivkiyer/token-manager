'use client';

import { useState, useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

import isErrorInForm from '@/utils/forms/isErrorInForm';

function WithdrawEther({ web3, wallet }: { web3: any; wallet: any }) {
  const [error, setError] = useState<string | null>(null);
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);

  const fetchActiveAccount = useCallback(async () => {
    if (web3 !== null && web3 !== undefined) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setActiveAccount(accounts[0]);
        setAccountError(null);
      } else {
        setAccountError('No linked Metamask account found');
      }
    }
  }, [web3]);

  const verifyAccountAccess = useCallback(async () => {
    if (web3 !== null && web3 !== undefined) {
      await fetchActiveAccount();

      const userAccounts = wallet.user.map(
        (item: { id: number; address: string; name: string }) => item.address
      );
      if (activeAccount !== null && !userAccounts.includes(activeAccount)) {
        setAccountError('Linked Metamask account is not a wallet user');
      }
    }
  }, [web3, wallet, activeAccount, fetchActiveAccount]);

  useEffect(() => {
    setError(null);
    if (web3 === null || web3 === undefined) {
      setError('Metamask needs to be unlocked to manage the wallet');
      return;
    }

    verifyAccountAccess();
  }, [web3, wallet, activeAccount, verifyAccountAccess]);

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
      if (web3 === null || web3 === undefined) {
        setError('Metamask is locked or account is unavilable');
        return;
      }
      await verifyAccountAccess();
      const amountInWei = await web3.utils.toWei(values.amount, 'ether');

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const contract = new web3.eth.Contract(wallet.abi, wallet.address);
      const estimateGas = await contract.methods
        .withdraw(amountInWei)
        .estimateGas({ from: account });
      const actualGas = (estimateGas * BigInt(2)).toString();

      const result = await contract.methods
        .withdraw(amountInWei)
        .send({ from: account, gas: actualGas });
      if (
        result.transactionHash === null ||
        result.transactionHash === undefined
      ) {
        throw Object.assign(new Error());
      }
      resetForm();
    } catch (e) {
      setError('Could not withdraw funds');
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
              <p className='error-message' style={{ textAlign: 'left' }}>
                {accountError}
              </p>
            </Grid>
            <Grid size={{ xs: 9, md: 7 }} paddingTop={0.5}>
              <p>Change the Metamask account and click on refresh</p>
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
                Submit
              </Button>
              {withdrawalForm.touched.amount &&
                withdrawalForm.errors.amount && (
                  <span className='error-message' style={{ textAlign: 'left' }}>
                    {withdrawalForm.errors.amount.toString()}
                  </span>
                )}
            </Grid>

            {error && (
              <Grid size={12} marginTop={1}>
                <p className='error-message' style={{ textAlign: 'left' }}>
                  {error}
                </p>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </form>
  );
}

export default WithdrawEther;

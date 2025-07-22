'use client';

import { formatEther, parseEther } from 'ethers';
import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Wallet } from '@/interfaces/wallet';

export default function DepositEther({
  ethers,
  wallet,
}: {
  ethers: any;
  wallet: Wallet;
}) {
  const [displayForm, setDisplayForm] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);

  const getWalletBalance = useCallback(async () => {
    try {
      const walletBalance = await ethers.getBalance(wallet.address);
      const etherBalance = formatEther(walletBalance);
      setBalance(etherBalance);
    } catch (e) {}
  }, [ethers, wallet]);

  const submitHandler = async (
    values: { etherValue: string },
    resetForm: () => void
  ) => {
    setError(null);
    try {
      const depositValue = parseEther(values.etherValue);
      const signerAccount = await ethers.getSigner();
      const ownerAccount = signerAccount.address;

      if (wallet.owner.address !== ownerAccount) {
        setError('Linked Metamask account is not the wallet owner');
        return;
      }

      const gasEstimate = await ethers.estimateGas({
        from: ownerAccount,
        to: wallet.address,
      });
      const gas = (gasEstimate * BigInt(2)).toString();
      const resultDeposit = await signerAccount.sendTransaction({
        from: ownerAccount,
        to: wallet.address,
        value: depositValue,
        gas,
      });
      await resultDeposit.wait();
      resetForm();
      await getWalletBalance();
      setDisplayForm(false);
      setError(null);
    } catch (e) {
      setError('Could not deposit funds in wallet.');
    }
  };

  useEffect(() => {
    if (ethers !== null && ethers !== undefined) {
      getWalletBalance();
    }
  }, [ethers, getWalletBalance]);

  const validateHandler = () => {
    return Yup.object({
      etherValue: Yup.number()
        .required('Required')
        .positive('Ether value must be positive')
        .typeError('Ether value must be a number'),
    });
  };

  const etherDepositForm = useFormik({
    initialValues: {
      etherValue: '',
    },
    validationSchema: validateHandler,
    onSubmit: (values, { resetForm }) => submitHandler(values, resetForm),
  });

  const showForm = () => {
    setDisplayForm(true);
  };

  const hideForm = () => {
    setDisplayForm(false);
    setError(null);
  };

  return (
    <>
      <Grid size={{ xs: 12 }} marginTop={3}>
        <Typography
          variant='h6'
          data-testid='test-ether-balance'
          sx={{ display: 'inline-block' }}
        >
          Current balance: {balance} Ether
        </Typography>
        <Button
          variant='contained'
          sx={{ marginLeft: '16px' }}
          onClick={showForm}
        >
          <Typography variant='button'>Deposit Ether</Typography>
        </Button>
      </Grid>

      {displayForm && (
        <Grid size={{ xs: 12 }} marginTop={3}>
          <form onSubmit={etherDepositForm.handleSubmit}>
            <TextField
              name='etherValue'
              variant='standard'
              placeholder='Amount in Ether'
              value={etherDepositForm.values.etherValue}
              onChange={etherDepositForm.handleChange}
              onBlur={etherDepositForm.handleBlur}
            ></TextField>
            <Button
              variant='contained'
              sx={{ marginLeft: '16px' }}
              type='submit'
            >
              <Typography variant='button'>Deposit</Typography>
            </Button>
            <Button
              variant='contained'
              color='error'
              sx={{ marginLeft: '16px' }}
              onClick={hideForm}
            >
              <Typography variant='button'>Cancel</Typography>
            </Button>
            {etherDepositForm.touched.etherValue &&
              etherDepositForm.errors.etherValue && (
                <Typography
                  color='error'
                  variant='body1'
                  sx={{ textAlign: 'left' }}
                >
                  {etherDepositForm.errors.etherValue}
                </Typography>
              )}
          </form>
          {error && (
            <Typography
              color='error'
              variant='body1'
              sx={{ textAlign: 'left', marginTop: '10px' }}
            >
              {error}
            </Typography>
          )}
        </Grid>
      )}
    </>
  );
}

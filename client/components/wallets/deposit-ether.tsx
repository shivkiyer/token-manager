import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function DepositEther({
  web3,
  wallet,
}: {
  web3: any;
  wallet: any;
}) {
  const [displayForm, setDisplayForm] = useState(false);
  const [balance, setBalance] = useState<BigInt>(BigInt(0));
  const [error, setError] = useState<string | null>(null);

  const getWalletBalance = useCallback(async () => {
    try {
      const walletBalance = await web3.eth.getBalance(wallet.address);
      const etherBalance = await web3.utils.fromWei(walletBalance, 'ether');
      setBalance(etherBalance);
    } catch (e) {}
  }, [web3, wallet]);

  const submitHandler = async (
    values: { etherValue: string },
    resetForm: any
  ) => {
    setError(null);
    try {
      const depositValue = web3.utils.toWei(values.etherValue, 'ether');
      const linkedAccounts = await web3.eth.getAccounts();
      const ownerAccount = linkedAccounts[0];

      if (wallet.owner.address !== ownerAccount) {
        setError('Linked Metamask account is not the wallet owner');
        return;
      }

      const gasEstimate = await web3.eth.estimateGas({
        from: ownerAccount,
        to: wallet.address,
      });
      const gas = (gasEstimate * BigInt(2)).toString();
      await web3.eth.sendTransaction({
        from: ownerAccount,
        to: wallet.address,
        value: depositValue,
        gas,
      });
      resetForm();
      await getWalletBalance();
      setDisplayForm(false);
      setError(null);
    } catch (e) {
      setError('Could not deposit funds in wallet.');
    }
  };

  useEffect(() => {
    if (web3 !== null && web3 !== undefined) {
      getWalletBalance();
    }
  }, [web3, getWalletBalance]);

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
          Current balance: {balance.toString()} Ether
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

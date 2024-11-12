import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function DepositEther({ web3, wallet }: { web3: any; wallet: any }) {
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
      <Grid item xs={12} marginTop={3}>
        <h4 style={{ display: 'inline-block' }}>
          Current balance: {balance.toString()} Ether
        </h4>
        <Button
          variant='contained'
          sx={{ marginLeft: '16px' }}
          onClick={showForm}
        >
          Deposit Ether
        </Button>
      </Grid>

      {displayForm && (
        <Grid item xs={12} marginTop={3}>
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
              Deposit
            </Button>
            <Button
              variant='contained'
              color='error'
              sx={{ marginLeft: '16px' }}
              onClick={hideForm}
            >
              Cancel
            </Button>
            {etherDepositForm.touched.etherValue &&
              etherDepositForm.errors.etherValue && (
                <p className='error-message' style={{ textAlign: 'left' }}>
                  {etherDepositForm.errors.etherValue}
                </p>
              )}
          </form>
          {error && (
            <p
              className='error-message'
              style={{ textAlign: 'left', marginTop: '10px' }}
            >
              {error}
            </p>
          )}
        </Grid>
      )}
    </>
  );
}

export default DepositEther;

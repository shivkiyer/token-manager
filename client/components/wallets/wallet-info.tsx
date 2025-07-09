'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';

import { Wallet, WalletForm } from '@/interfaces/wallet';
import updateWalletDetails from '@/actions/wallet/updateWalletDetails';
import isErrorInForm from '@/utils/forms/isErrorInForm';
import formatEthAddress from '@/utils/web3/formatEthAddress';

function WalletInfo({
  web3,
  wallet,
  editable,
}: {
  web3: any;
  wallet: Wallet | null;
  editable: boolean;
}) {
  const [displayForm, setDisplayForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<Wallet | null>(null);

  useEffect(() => {
    if (wallet) {
      setWalletData(wallet);
    }
  }, [wallet]);

  const displayFormHandler = () => {
    setDisplayForm(true);
  };

  const hideFormHandler = () => {
    setDisplayForm(false);
  };

  const validateHandler = () => {
    return Yup.object({
      name: Yup.string()
        .min(2, 'Must be at least two characters')
        .required('Required'),
      description: Yup.string().max(6000, 'Must be less than 6000 characters'),
      maxLimit: Yup.number()
        .required('Required')
        .positive('Max withdrawal limit must be positive')
        .typeError('Max withdrawal limit must be a number'),
    });
  };

  const updateHandler = async (values: WalletForm) => {
    try {
      setError(null);

      if (!wallet) throw new Error();
      const response = await updateWalletDetails(wallet.address, values);
      if (response.data) {
        const oldMaxLimit = wallet?.maxLimit;
        setWalletData(wallet);

        if (oldMaxLimit !== response.data.maxLimit && web3) {
          const web3Accounts = await web3.eth.getAccounts();
          const web3Account = web3Accounts[0];

          if (wallet.owner.address !== web3Account) {
            setError('Linked Metamask account is not the wallet owner');
            return;
          }

          const walletContract = new web3.eth.Contract(
            wallet.abi,
            wallet.address
          );

          const maxLimitInWei = await web3.utils.toWei(
            response.data.maxLimit,
            'ether'
          );
          const gasEstimate = await walletContract.methods
            .updateWithdrawalLimit(maxLimitInWei)
            .estimateGas({ from: web3Account });
          const actualGas = gasEstimate * BigInt(2);
          const web3Response = await walletContract.methods
            .updateWithdrawalLimit(maxLimitInWei)
            .send({ from: web3Account, gas: actualGas.toString() });

          if (
            web3Response.transactionHash === null ||
            web3Response.transactionHash === undefined
          ) {
            throw new Error();
          }
        }

        hideFormHandler();
      } else if (response.message) {
        setError(response.message);
      }
    } catch (e) {
      setError('Could not update wallet');
    }
  };

  const walletForm = useFormik({
    initialValues: {
      name: walletData?.name || '',
      description: walletData?.description || '',
      maxLimit: walletData?.maxLimit ? walletData.maxLimit.toString() : '',
    },
    validationSchema: validateHandler,
    onSubmit: (values) => updateHandler(values),
    enableReinitialize: true,
  });

  const getDisabledStatus = () => {
    return isErrorInForm(walletForm);
  };

  return (
    <>
      {displayForm ? (
        <form onSubmit={walletForm.handleSubmit}>
          <Grid size={{ xs: 12, md: 10 }}>
            <TextField
              name='name'
              label='Wallet name'
              variant='standard'
              value={walletForm.values.name}
              onChange={walletForm.handleChange}
              onBlur={walletForm.handleBlur}
              fullWidth
            ></TextField>
            {walletForm.touched.name && walletForm.errors.name && (
              <Typography color='error' variant='body1'>
                {walletForm.errors.name.toString()}
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 10 }} marginTop={3}>
            <TextField
              name='description'
              label='Description'
              variant='standard'
              value={walletForm.values.description}
              onChange={walletForm.handleChange}
              onBlur={walletForm.handleBlur}
              fullWidth
              multiline
              maxRows={4}
            ></TextField>
            {walletForm.touched.description &&
              walletForm.errors.description && (
                <Typography color='error' variant='body1'>
                  {walletForm.errors.description.toString()}
                </Typography>
              )}
          </Grid>

          <Grid size={{ xs: 12, md: 10 }} marginTop={3}>
            <TextField
              name='maxLimit'
              label='Max withdrawal limit in Ether'
              variant='standard'
              value={walletForm.values.maxLimit}
              onChange={walletForm.handleChange}
              onBlur={walletForm.handleBlur}
              fullWidth
            ></TextField>
            {walletForm.touched.maxLimit && walletForm.errors.maxLimit && (
              <Typography color='error' variant='body1'>
                {walletForm.errors.maxLimit.toString()}
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 8 }} marginTop={3} marginBottom={4}>
            <Button
              variant='contained'
              type='submit'
              disabled={getDisabledStatus()}
            >
              <Typography variant='button'>Update</Typography>
            </Button>

            <Button
              variant='contained'
              color='error'
              onClick={hideFormHandler}
              sx={{ marginLeft: '12px' }}
            >
              <Typography variant='button'>Cancel</Typography>
            </Button>
          </Grid>
          {error && (
            <Grid size={{ xs: 12, md: 10 }} marginTop={1}>
              <Typography
                color='error'
                variant='body1'
                sx={{ textAlign: 'left' }}
              >
                {error}
              </Typography>
            </Grid>
          )}
        </form>
      ) : (
        <>
          <Grid size={12}>
            <Grid container>
              <Grid size={10}>
                <h2>{walletData?.name}</h2>
              </Grid>
              <Grid size={2}>
                {editable && (
                  <Button
                    sx={{
                      padding: '0px',
                      verticalAlign: 'top',
                      marginTop: '4px',
                    }}
                    onClick={displayFormHandler}
                  >
                    <EditIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid size={12} marginTop={2}>
            <Typography variant='body1'>
              <strong>Account owner: </strong>
              {formatEthAddress(wallet?.owner?.address)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 10 }} marginTop={2}>
            <Typography variant='body1'>
              <strong>Max withdrawal limit: </strong>
              {walletData?.maxLimit} Ether
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 10 }} marginTop={2}>
            <Typography variant='body1'>
              <strong>Description: </strong>
              {walletData?.description !== null
                ? walletData?.description
                : 'Not provided'}
            </Typography>
          </Grid>
        </>
      )}
    </>
  );
}

export default WalletInfo;

'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { WalletForm } from '@/interfaces/wallet';
import getWeb3 from '@/utils/web3/web3';
import formatEthAddress from '@/utils/web3/formatEthAddress';
import isErrorInForm from '@/utils/forms/isErrorInForm';
import createWallet from '@/actions/wallet/createWallet';
import verifyWallet from '@/actions/wallet/verifyWallet';
import getContractFactoryData from '@/actions/contract-factory/getContracyFactoryData';

export default function CreateWallet() {
  const [web3Error, setWeb3Error] = useState<string | null>(null);
  const [web3, setWeb3] = useState<any>(null);
  const [ownerAccount, setOwnerAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getEthAccounts = async () => {
    let metamask: any;
    if (!web3) {
      metamask = await getWeb3();
      setWeb3(metamask);
    } else {
      metamask = web3;
    }
    if (metamask) {
      const accounts = await metamask.eth.getAccounts();
      if (accounts.length > 0) {
        setOwnerAccount(accounts[0]);
        setWeb3Error(null);
      } else {
        setWeb3Error(
          'No Metamask account found to be linked with this website'
        );
      }
    } else {
      setWeb3Error('Unlock Metamask to continue');
    }
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

  const submitHandler = async (values: WalletForm, resetForm: () => void) => {
    setLoading(true);
    try {
      const verifyResult = await verifyWallet(ownerAccount, values);
      if (verifyResult?.message) {
        setError(verifyResult.message);
        setLoading(false);
        return;
      }

      const contractFactoryDataResponse = await getContractFactoryData();
      if (contractFactoryDataResponse.message) {
        setError(contractFactoryDataResponse.message);
        return;
      }
      const { abi: contractFactoryAbi, address: contractFactoryAddress } =
        contractFactoryDataResponse.data;

      const contractFactory = new web3.eth.Contract(
        contractFactoryAbi,
        contractFactoryAddress
      );

      const maxLimitWei = web3.utils.toWei(values.maxLimit.trim(), 'ether');

      const estimateGas = await contractFactory.methods
        .createSharedWallet(maxLimitWei)
        .estimateGas({ from: ownerAccount });
      const actualGas = (estimateGas * BigInt(2)).toString();

      const contractFactoryResponse = await contractFactory.methods
        .createSharedWallet(maxLimitWei)
        .send({
          from: ownerAccount,
          gas: actualGas,
        });
      const newWalletAddress =
        contractFactoryResponse.events.SharedWalletCreated.returnValues.wallet;

      const walletResult = await createWallet(
        ownerAccount,
        newWalletAddress,
        values
      );

      if (walletResult.message) {
        setError(walletResult.message);
        setSuccess(null);
      } else {
        setError(null);
        setSuccess(
          'Wallet created successfully. Go to LIST tab to view wallets.'
        );
        resetForm();
      }

      setLoading(false);
    } catch (e) {
      setSuccess(null);
      setError('Wallet could not be created.');
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      maxLimit: '',
    },
    validationSchema: validateHandler,
    onSubmit: (values, { resetForm }) => submitHandler(values, resetForm),
  });

  const getDisabledStatus = () => {
    return isErrorInForm(formik);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid
          container
          alignContent='center'
          justifyContent='center'
          paddingLeft={0}
        >
          <Grid size={{ xs: 12, md: 6 }} paddingLeft={0}>
            <TextField
              name='name'
              variant='standard'
              placeholder='Wallet name'
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
            ></TextField>
            {formik.touched.name && formik.errors.name && (
              <Typography color='error' variant='body1'>
                {formik.errors.name}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid
          container
          alignContent='center'
          justifyContent='center'
          marginTop={5}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name='description'
              variant='standard'
              placeholder='Wallet description'
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              multiline
              maxRows={4}
            ></TextField>
            {formik.touched.description && formik.errors.description && (
              <Typography color='error' variant='body1'>
                {formik.errors.description}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid
          container
          alignContent='center'
          justifyContent='center'
          marginTop={5}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name='maxLimit'
              variant='standard'
              placeholder='Maximum withdrawal limit (in ether)'
              value={formik.values.maxLimit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
            ></TextField>
            {formik.touched.maxLimit && formik.errors.maxLimit && (
              <Typography color='error' variant='body1'>
                {formik.errors.maxLimit}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid
          container
          alignContent='center'
          justifyContent='center'
          marginTop={5}
        >
          <Grid size={{ xs: 8, md: 5 }} paddingTop={0.5}>
            <Typography variant='body1'>
              <strong>Wallet Owner: </strong>
              {ownerAccount
                ? formatEthAddress(ownerAccount)
                : 'Use FETCH button'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 4, md: 1 }}>
            <Button
              sx={{ marginLeft: '10px' }}
              variant='contained'
              type='button'
              onClick={getEthAccounts}
            >
              <Typography variant='button'>
                {ownerAccount ? 'Change' : 'Fetch'}
              </Typography>
            </Button>
          </Grid>
        </Grid>

        {ownerAccount && (
          <Grid
            container
            alignContent='center'
            justifyContent='center'
            marginTop={2}
          >
            <Grid
              size={{ xs: 12, md: 6 }}
              alignContent='left'
              justifyContent='left'
            >
              <Typography variant='body1'>
                This is the connected user on Metamask. If this is not the
                intended owner of the wallet, select another account on Metamask
                and click on the CHANGE button.
              </Typography>
            </Grid>
          </Grid>
        )}

        {web3Error && (
          <Grid
            container
            alignContent='center'
            justifyContent='center'
            marginTop={5}
          >
            <Grid size={{ xs: 10, md: 6 }} sx={{ textAlign: 'center' }}>
              <Typography color='error' variant='body1'>
                {web3Error}
              </Typography>
            </Grid>
          </Grid>
        )}

        {error && (
          <Grid
            container
            alignContent='center'
            justifyContent='center'
            marginTop={5}
          >
            <Grid size={{ xs: 10, md: 6 }} sx={{ textAlign: 'center' }}>
              <Typography color='error' variant='body1'>
                {error}
              </Typography>
            </Grid>
          </Grid>
        )}

        <Grid
          container
          alignContent='center'
          justifyContent='center'
          marginTop={5}
        >
          <Grid size={{ xs: 10, md: 6 }} sx={{ textAlign: 'center' }}>
            {loading ? (
              <CircularProgress size={26} />
            ) : (
              <Button
                variant='contained'
                type='submit'
                disabled={getDisabledStatus() || !ownerAccount}
              >
                <Typography variant='button'>Create Wallet</Typography>
              </Button>
            )}
          </Grid>
        </Grid>

        {success && (
          <Grid
            container
            alignContent='center'
            justifyContent='center'
            marginTop={5}
          >
            <Grid size={{ xs: 10, md: 6 }} sx={{ textAlign: 'center' }}>
              <Typography variant='body1'>{success}</Typography>
            </Grid>
          </Grid>
        )}
      </form>
    </>
  );
}

import { useState, useContext, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';

import { Web3Context } from './../../../app/context/web3-context-provider';
import formatEthAddress from '../../../utils/web3/formatEthAddress';
import isErrorInForm from '../../../utils/forms/isErrorInForm';
import apiCall from '../../../utils/http/api-call';
import useTokenAuthentication from '../../../hooks/useTokenAuthentication';
import { clearToken } from '../../../utils/auth/auth';

function RegisterWallet() {
  const navigate = useNavigate();
  const [web3Error, setWeb3Error] = useState<string | null>(null);
  const [ownerAccount, setOwnerAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { web3, contractFactoryAddress, contractFactoryAbi } =
    useContext(Web3Context);
  const userToken: string | null = useTokenAuthentication();

  const getEthAccounts = useCallback(async () => {
    if (web3 !== null && web3 !== undefined) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setOwnerAccount(formatEthAddress(accounts[0]));
      }
      setWeb3Error(null);
    } else {
      setWeb3Error('Metamask is locked. Please unlock and refresh the page.');
    }
  }, [web3, setOwnerAccount]);

  const handleRefreshEthAccount = () => {
    getEthAccounts();
  };

  useEffect(() => {
    if (web3 !== null && web3 !== undefined) {
      getEthAccounts();
    } else {
      setWeb3Error('Metamask is locked. Please unlock and refresh the page.');
    }
  }, [web3, getEthAccounts]);

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

  const submitHandler = async (
    values: {
      name: string;
      description: string;
      maxLimit: string;
    },
    resetForm: any
  ) => {
    setLoading(true);
    try {
      const authHeader = { Authorization: userToken || '' };
      const verificationResponse = await apiCall(
        `${process.env.REACT_APP_BASE_API_URL}/api/wallets/verify-wallet`,
        'POST',
        authHeader,
        { name: values.name.trim(), owner: ownerAccount }
      );

      if (!verificationResponse.ok) {
        const verificationResponseData = await verificationResponse.json();
        if (
          verificationResponseData.message !== undefined &&
          verificationResponseData.message !== null
        ) {
          if (
            verificationResponseData.message.includes('Authorization failed')
          ) {
            clearToken();
            navigate('/login');
          }
          setError(verificationResponseData.message);
        }
        setLoading(false);
        return;
      }

      const contractFactory = new web3.eth.Contract(
        contractFactoryAbi,
        contractFactoryAddress
      );

      const maxLimitWei = web3.utils.toWei(
        formik.values.maxLimit.trim(),
        'ether'
      );

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

      const writeWalletResponse = await apiCall(
        `${process.env.REACT_APP_BASE_API_URL}/api/wallets/create`,
        'POST',
        authHeader,
        {
          name: values.name.trim(),
          description: values.description.trim(),
          maxLimit: Number(values.maxLimit),
          address: newWalletAddress,
          owner: ownerAccount,
        }
      );

      if (!writeWalletResponse.ok) {
        const errorMessage = await writeWalletResponse.json();
        if (
          errorMessage.message !== null &&
          errorMessage.message !== undefined
        ) {
          console.log(errorMessage);
          setError(errorMessage.message);
        } else {
          setError('Wallet not written to database.');
        }
        setSuccess(null);
        setLoading(false);
        return;
      } else {
        resetForm();
        setError(null);
        setSuccess(
          'Wallet created successfully. Go to the LIST tab to view wallets.'
        );
        setLoading(false);
      }
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
      {web3Error !== null ? (
        <h3>{web3Error}</h3>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            alignContent='center'
            justifyContent='center'
            paddingLeft={0}
          >
            <Grid item xs={10} md={6} paddingLeft={0}>
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
                <p className='error-message'>{formik.errors.name}</p>
              )}
            </Grid>
          </Grid>

          <Grid
            container
            alignContent='center'
            justifyContent='center'
            marginTop={5}
          >
            <Grid item xs={10} md={6}>
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
                <p className='error-message'>{formik.errors.description}</p>
              )}
            </Grid>
          </Grid>

          <Grid
            container
            alignContent='center'
            justifyContent='center'
            marginTop={5}
          >
            <Grid item xs={10} md={6}>
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
                <p className='error-message'>{formik.errors.maxLimit}</p>
              )}
            </Grid>
          </Grid>

          <Grid
            container
            alignContent='center'
            justifyContent='center'
            marginTop={5}
          >
            <Grid item xs={8} md={5} paddingTop={0.5}>
              <p>
                <strong>Wallet Owner: </strong>
                {ownerAccount}
              </p>
            </Grid>
            <Grid item xs={2} md={1}>
              <Button sx={{ padding: '0px' }} onClick={handleRefreshEthAccount}>
                <RefreshIcon />
              </Button>
            </Grid>
          </Grid>

          <Grid
            container
            alignContent='center'
            justifyContent='center'
            marginTop={2}
          >
            <Grid item xs={10} md={6} alignContent='left' justifyContent='left'>
              <p>
                This is the first connected user on Metamask. If this is not the
                intended owner of the wallet, select another account on Metamask
                and click on the refresh icon.
              </p>
            </Grid>
          </Grid>

          {error && (
            <Grid
              container
              alignContent='center'
              justifyContent='center'
              marginTop={5}
            >
              <Grid item xs={10} md={6} sx={{ textAlign: 'center' }}>
                <p className='error-message'>{error}</p>
              </Grid>
            </Grid>
          )}

          <Grid
            container
            alignContent='center'
            justifyContent='center'
            marginTop={5}
          >
            <Grid item xs={10} md={6} sx={{ textAlign: 'center' }}>
              {loading ? (
                <CircularProgress size={26} />
              ) : (
                <Button
                  variant='contained'
                  type='submit'
                  disabled={getDisabledStatus()}
                >
                  Create Wallet
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
              <Grid item xs={10} md={6} sx={{ textAlign: 'center' }}>
                <h4>{success}</h4>
              </Grid>
            </Grid>
          )}
        </form>
      )}
    </>
  );
}

export default RegisterWallet;

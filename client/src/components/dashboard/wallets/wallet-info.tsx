import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';

import apiCall from '../../../utils/http/api-call';
import { authToken, clearToken } from '../../../utils/auth/auth';
import formatEthAddress from '../../../utils/web3/formatEthAddress';
import isErrorInForm from '../../../utils/forms/isErrorInForm';

interface WalletData {
  name: string;
  description: string;
  maxLimit: number;
}

function WalletInfo({ web3, wallet }: { web3: any; wallet: any }) {
  const [displayForm, setDisplayForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const navigate = useNavigate();
  const userToken = authToken();

  useEffect(() => {
    if (wallet !== null && wallet !== undefined) {
      setWalletData({
        name: wallet.name,
        description: wallet.description,
        maxLimit: wallet.maxLimit,
      });
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

  const updateHandler = async (values: any) => {
    try {
      setError(null);
      const authHeader = { Authorization: userToken || '' };
      const response = await apiCall(
        `${process.env.REACT_APP_BASE_API_URL}/api/wallets/${wallet.address}/`,
        'PATCH',
        authHeader,
        values
      );
      const responseData = await response.json();
      if (
        response.ok &&
        responseData.data !== null &&
        responseData.data !== undefined
      ) {
        const oldMaxLimit = walletData?.maxLimit;
        setWalletData({
          name: responseData.data.name,
          description: responseData.data.description,
          maxLimit: responseData.data.maxLimit,
        });

        if (
          oldMaxLimit !== responseData.data.maxLimit &&
          web3 !== null &&
          web3 !== undefined
        ) {
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
            responseData.data.maxLimit,
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
      } else if (
        !response.ok &&
        responseData.message !== null &&
        responseData.message !== undefined
      ) {
        if (responseData.message.includes('Authorization failed')) {
          clearToken();
          navigate('/login');
        }
        setError(responseData.message);
      }
    } catch (e) {
      setError('Could not update wallet');
    }
  };

  const walletForm = useFormik({
    initialValues: {
      name: walletData?.name,
      description: walletData?.description,
      maxLimit: walletData?.maxLimit,
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
          <Grid item xs={12} md={10}>
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
              <p className='error-message'>
                {walletForm.errors.name.toString()}
              </p>
            )}
          </Grid>

          <Grid item xs={12} md={10} marginTop={3}>
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
                <p className='error-message'>
                  {walletForm.errors.description.toString()}
                </p>
              )}
          </Grid>

          <Grid item xs={12} md={10} marginTop={3}>
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
              <p className='error-message'>
                {walletForm.errors.maxLimit.toString()}
              </p>
            )}
          </Grid>

          <Grid item xs={12} md={8} marginTop={3} marginBottom={4}>
            <Button
              variant='contained'
              type='submit'
              disabled={getDisabledStatus()}
            >
              Update
            </Button>

            <Button
              variant='contained'
              color='error'
              onClick={hideFormHandler}
              sx={{ marginLeft: '12px' }}
            >
              Cancel
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12} md={10} marginTop={1}>
              <p className='error-message' style={{ textAlign: 'left' }}>
                {error}
              </p>
            </Grid>
          )}
        </form>
      ) : (
        <>
          <Grid item xs={12}>
            <h2 style={{ display: 'inline-block' }}>{walletData?.name}</h2>
            <Button
              sx={{ padding: '0px', verticalAlign: 'top', marginTop: '4px' }}
              onClick={displayFormHandler}
            >
              <EditIcon />
            </Button>
          </Grid>

          <Grid item xs={12} marginTop={2}>
            <p>
              <strong>Account owner: </strong>
              {formatEthAddress(wallet.owner.address)}
            </p>
          </Grid>

          <Grid item xs={12} marginTop={2}>
            <p>
              <strong>Max withdrawal limit: </strong>
              {walletData?.maxLimit} Ether
            </p>
          </Grid>

          <Grid item xs={12} marginTop={2}>
            <p>
              <strong>Description: </strong>
              {walletData?.description !== null
                ? walletData?.description
                : 'Not provided'}
            </p>
          </Grid>
        </>
      )}
    </>
  );
}

export default WalletInfo;

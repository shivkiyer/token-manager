import { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import apiCall from '../../../utils/http/api-call';
import verifyWeb3 from '../../../utils/web3/verifyWeb3';
import { AppContext } from '../../../app/context/app-context-provider';
import useTokenAuthentication from '../../../hooks/useTokenAuthentication';

function RegisterAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const userToken: string | null = useTokenAuthentication();
  const { web3 } = useContext(AppContext);

  const validateHandler = () => {
    setSuccess(null);
    setError(null);
    return Yup.object({
      name: Yup.string()
        .min(2, 'Must be at least two characters')
        .required('Required'),
      address: Yup.string().required('Required'),
    });
  };

  const submitHandler = async (name: string, address: string) => {
    setLoading(true);

    const web3AccountErr: string | null = await verifyWeb3(web3);
    if (web3AccountErr !== null) {
      setError(web3AccountErr);
      setSuccess(null);
      setLoading(false);
      return;
    }
    const accounts = await web3.eth.getAccounts();
    if (!accounts.includes(address)) {
      setError('Account is not linked in Metamask.');
      setSuccess(null);
      setLoading(false);
      return;
    }

    try {
      const authHeader = { Authorization: userToken || '' };
      const response = await apiCall(
        `${process.env.REACT_APP_BASE_API_URL}/api/eth-accounts/add`,
        'POST',
        authHeader,
        { accountName: name.trim(), accountAddress: address.trim() }
      );
      const responseData = await response.json();
      if (!response.ok) {
        if (
          responseData.message !== null ||
          responseData.message !== undefined
        ) {
          setError(responseData.message);
        } else {
          Object.assign(new Error());
        }
      } else {
        setSuccess(
          'Account successfully added! Go to the LIST tab to view accounts.'
        );
        formik.values.name = '';
        formik.values.address = '';
      }
    } catch (e) {
      setError(
        'Account could not be added. Please try again later or contact the admin.'
      );
    }
    setLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
    },
    validationSchema: validateHandler,
    onSubmit: (values) => submitHandler(values.name, values.address),
  });

  const getDisabledStatus = () => {
    if (Object.keys(formik.touched).length > 0) {
      if (Object.keys(formik.errors).length === 0) {
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container alignContent='center' justifyContent='center'>
          <Grid item xs={10} md={6}>
            <TextField
              name='name'
              variant='standard'
              placeholder='Name'
              required
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
              name='address'
              variant='standard'
              placeholder='Address'
              value={formik.values.address}
              required
              fullWidth
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></TextField>
            {formik.touched.address && formik.errors.address && (
              <p className='error-message'>{formik.errors.address}</p>
            )}
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
                Add
              </Button>
            )}
          </Grid>
        </Grid>

        <Grid
          container
          alignContent='center'
          justifyContent='center'
          marginTop={5}
        >
          <Grid item xs={10} md={6} sx={{ textAlign: 'center' }}>
            {success && <h4>{success}</h4>}
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default RegisterAccount;

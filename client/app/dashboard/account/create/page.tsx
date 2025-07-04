'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import isErrorInForm from '@/utils/forms/isErrorInForm';
import getWeb3 from '@/utils/web3/web3';
import registerAccount from '@/actions/eth/registerAccount';

function RegisterAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null | undefined>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

    let web3: any;
    try {
      web3 = await getWeb3();
    } catch (_) {
      setError('Metamask locked or inaccessible');
      setLoading(false);
      return;
    }

    let accounts: string[];
    try {
      accounts = await web3.eth.getAccounts();
    } catch (_) {
      setError('Account is not linked in Metamask.');
      setLoading(false);
      return;
    }

    const result = await registerAccount(accounts, { name, address });

    if (result?.success) {
      setSuccess(result?.message);
      setError(null);
      formik.values.name = '';
      formik.values.address = '';
    } else {
      setSuccess(null);
      setError(result?.message);
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
    return isErrorInForm(formik);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container alignContent='center' justifyContent='center'>
          <Grid size={{ xs: 10, md: 6 }}>
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
          <Grid size={{ xs: 10, md: 6 }}>
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
            <Grid size={{ xs: 10, md: 6 }} sx={{ textAlign: 'center' }}>
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
          <Grid size={{ xs: 10, md: 6 }} sx={{ textAlign: 'center' }}>
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
          <Grid size={{ xs: 10, md: 6 }} sx={{ textAlign: 'center' }}>
            {success && <h4>{success}</h4>}
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default RegisterAccount;

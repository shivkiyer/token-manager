'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import isErrorInForm from '@/utils/forms/isErrorInForm';
import getEthers from '@/utils/ethers/ethers';
import registerAccount from '@/actions/account/registerAccount';

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

    let provider: any;
    try {
      provider = await getEthers();
    } catch (_) {
      setError('Metamask locked or inaccessible');
      setLoading(false);
      return;
    }

    let account: string;
    try {
      const accountInfo = await provider.getSigner();
      account = accountInfo?.address;
    } catch (_) {
      setError('Account is not linked in Metamask.');
      setLoading(false);
      return;
    }

    const result = await registerAccount([account], { name, address });

    if (result?.message) {
      setSuccess(null);
      setError(result?.message);
    } else {
      setSuccess(
        'Account successfully added! Go to the LIST tab to view accounts'
      );
      setError(null);
      formik.values.name = '';
      formik.values.address = '';
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
              <Typography color='error' variant='body1'>
                {formik.errors.address}
              </Typography>
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
                disabled={getDisabledStatus()}
              >
                <Typography variant='button'>Add</Typography>
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
            {success && <Typography variant='body1'>{success}</Typography>}
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default RegisterAccount;

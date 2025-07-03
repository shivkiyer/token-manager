'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { AuthContext } from '@/providers/auth/auth-provider';
import isErrorInForm from '@/utils/forms/isErrorInForm';
import loginActionHandler from '@/actions/auth/login';

import classes from './page.module.css';

function LoginPage() {
  const [formPending, setFormPending] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const validateHandler = () => {
    setFormError(null);
    return Yup.object({
      username: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    });
  };

  const getDisabledStatus = () => {
    return isErrorInForm(formik);
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validateHandler,
    onSubmit: async (values) => {
      setFormPending(true);
      const result = await loginActionHandler(values);
      if (result.data) {
        await authContext.setToken(result.data);
        return router.push('/dashboard');
      }
      setFormPending(false);
      setFormError(result.message);
    },
  });

  return (
    <Container>
      <Box className={classes.LoginBox}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container>
            <Grid size={{ xs: 12 }}>
              <TextField
                name='username'
                variant='standard'
                placeholder='Username'
                required
                className={classes.LoginFields}
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></TextField>
              {formik.touched.username && formik.errors.username && (
                <Typography color='error' variant='body1'>
                  {formik.errors.username}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12 }} marginTop={5}>
              <TextField
                name='password'
                variant='standard'
                type='password'
                placeholder='Password'
                required
                className={classes.LoginFields}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></TextField>
              {formik.touched.password && formik.errors.password && (
                <Typography color='error' variant='body1'>
                  {formik.errors.password}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12 }} marginTop={3}>
              {formError && (
                <Typography color='error' variant='body1'>
                  {formError}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12 }} marginTop={2}>
              {formPending ? (
                <CircularProgress size={26} />
              ) : (
                <Button
                  disabled={getDisabledStatus()}
                  type='submit'
                  variant='contained'
                  className={classes.LoginFields}
                >
                  <Typography variant='button'>Login</Typography>
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default LoginPage;

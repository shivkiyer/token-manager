import { useState, useEffect } from 'react';
import {
  Form,
  useNavigation,
  useActionData,
  useNavigate,
} from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import classes from './login-page.module.css';

function LoginPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const navigation = useNavigation();
  const actionData: any = useActionData();
  const navigate = useNavigate();

  const validateHandler = () => {
    setFormError(null);
    return Yup.object({
      username: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    });
  };

  useEffect(() => {
    if (navigation.state === 'submitting') {
      setFormError(null);
    } else if (
      actionData !== null &&
      actionData !== undefined &&
      actionData.message !== null
    ) {
      if (actionData.message === null || actionData.message === undefined) {
        navigate('/dashboard');
      }
      setFormError(actionData.message);
    }
  }, [navigation.state, actionData, navigate]);

  const getDisabledStatus = () => {
    if (Object.keys(formik.touched).length > 0) {
      if (Object.keys(formik.errors).length === 0) {
        return false;
      }
    }
    return true;
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validateHandler,
    onSubmit: () => {},
  });

  return (
    <Container>
      <Box className={classes.LoginBox}>
        <Form method='post'>
          <Grid container>
            <Grid item xs={12}>
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
                <p className='error-message'>{formik.errors.username}</p>
              )}
            </Grid>

            <Grid item xs={12} marginTop={5}>
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
                <p className='error-message'>{formik.errors.password}</p>
              )}
            </Grid>

            <Grid item xs={12} marginTop={3}>
              {formError && <p className='error-message'>{formError}</p>}
            </Grid>

            <Grid item xs={12} marginTop={2}>
              {navigation.state === 'submitting' ? (
                <CircularProgress size={26} />
              ) : (
                <Button
                  disabled={getDisabledStatus()}
                  type='submit'
                  variant='contained'
                  className={classes.LoginFields}
                >
                  <span>Login</span>
                </Button>
              )}
            </Grid>
          </Grid>
        </Form>
      </Box>
    </Container>
  );
}

export default LoginPage;

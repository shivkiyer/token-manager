import { useState, useEffect } from 'react';
import {
  Form,
  useNavigation,
  useActionData,
  useNavigate,
} from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';

import emailValidator from './../../utils/validators/email-validator';
import classes from './login-page.module.css';

function LoginPage() {
  const [isDisabled, setIsDisabled] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<any>(null);
  const navigation = useNavigation();
  const actionData: any = useActionData();
  const navigate = useNavigate();

  useEffect(() => {
    if (navigation.state === 'submitting') {
      setFormError(null);
      setIsDisabled(true);
    } else if (
      actionData !== null &&
      actionData !== undefined &&
      actionData.message !== null
    ) {
      if (actionData.message === null || actionData.message === undefined) {
        navigate('/dashboard');
      }
      setFormError(actionData.message);
      setIsDisabled(false);
    }
  }, [navigation.state, actionData, navigate]);

  const usernameChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    clearTimeout(timeoutId);
    setFormError(null);
    const timeout = setTimeout(() => {
      if (!emailValidator(event.target.value)) {
        setFormError('Not a valid email');
      } else {
        setFormError(null);
      }
    }, 1500);
    setTimeoutId(timeout);
  };

  const passwordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const password = event.target.value;
    if (password.trim().length > 2 && !formError) {
      setIsDisabled(false);
      setFormError(null);
    }
  };

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
                onChange={usernameChangeHandler}
              ></TextField>
            </Grid>
            <Grid item xs={12} marginTop={5}>
              <TextField
                name='password'
                variant='standard'
                type='password'
                placeholder='Password'
                required
                className={classes.LoginFields}
                onChange={passwordChangeHandler}
              ></TextField>
            </Grid>
            <Grid item xs={12} marginTop={3}>
              {formError && <p className='error-message'>{formError}</p>}
            </Grid>
            <Grid item xs={12} marginTop={2}>
              <Button
                disabled={isDisabled}
                type='submit'
                variant='contained'
                className={classes.LoginFields}
              >
                {navigation.state === 'submitting' ? (
                  <CircularProgress size={26} />
                ) : (
                  <span>Login</span>
                )}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Box>
    </Container>
  );
}

export default LoginPage;

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import classes from './login-page.module.css';

function LoginPage() {
  return (
    <Container>
      <Box className={classes.LoginBox}>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              variant='standard'
              placeholder='Username'
              className={classes.LoginFields}
            ></TextField>
          </Grid>
          <Grid item xs={12} marginTop={5}>
            <TextField
              variant='standard'
              type='password'
              placeholder='Password'
              className={classes.LoginFields}
            ></TextField>
          </Grid>
          <Grid item xs={12} marginTop={5}>
            <Button variant='contained' className={classes.LoginFields}>
              Login
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default LoginPage;

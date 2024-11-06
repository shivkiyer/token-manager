import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { authToken, clearToken } from '../../utils/auth/auth';
import classes from './navigation-bar.module.css';

function NavigationBar() {
  const userToken = authToken();
  const navigate = useNavigate();
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    setJwtToken(userToken);
  }, [userToken]);

  const loginHandler = () => {
    if (jwtToken !== null) {
      clearToken();
    }
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed' sx={{ zIndex: 2 }}>
        <Toolbar className={classes.AppBar}>
          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            <Link className='button-link button-link-white' to='/'>
              Token Manager
            </Link>
          </Typography>
          <Button sx={{ color: 'white' }} onClick={loginHandler}>
            {userToken ? 'Logout' : 'Login'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavigationBar;

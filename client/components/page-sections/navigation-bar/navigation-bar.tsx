'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

import classes from './navigation-bar.module.css';

function NavigationBar() {
  const router = useRouter();
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const loginHandler = () => {
    router.push('login');
    return;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed' sx={{ zIndex: 2 }}>
        <Toolbar className={classes.AppBar}>
          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            <Link className='button-link button-link-white' href='/'>
              Token Manager
            </Link>
          </Typography>
          <Button sx={{ color: 'white' }} onClick={loginHandler}>
            <Typography variant='button' sx={{ display: 'block' }}>
              {/* {userToken ? 'Logout' : 'Login'} */}
              Login
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavigationBar;

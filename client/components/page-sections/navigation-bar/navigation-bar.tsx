'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { AuthContext } from '@/providers/auth/auth-provider';
import { getSession } from '@/actions/auth/session';

import classes from './navigation-bar.module.css';

function NavigationBar() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [statusPending, setStatusPending] = useState<boolean>(true);

  const loginHandler = async () => {
    setStatusPending(true);
    await authContext.deleteToken();
    setJwtToken(null);
    setStatusPending(false);
    router.push('/login');
    return;
  };

  useEffect(() => {
    const getAuthToken = async () => {
      setStatusPending(true);
      setJwtToken(await getSession());
      setStatusPending(false);
    };
    getAuthToken();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='relative' sx={{ zIndex: 2 }}>
        <Toolbar className={classes.AppBar}>
          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            <Link className='button-link button-link-white' href='/'>
              Token Manager
            </Link>
          </Typography>

          <Button sx={{ color: 'white' }} onClick={loginHandler}>
            {statusPending ? (
              <CircularProgress size={22} sx={{ color: 'white' }} />
            ) : (
              <Typography variant='button' sx={{ display: 'block' }}>
                {jwtToken || authContext.getToken() ? 'Logout' : 'Login'}
              </Typography>
            )}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavigationBar;

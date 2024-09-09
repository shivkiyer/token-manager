import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import classes from './navigation-bar.module.css';

function NavigationBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed' sx={{ zIndex: 2 }}>
        <Toolbar className={classes.AppBar}>
          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            <Link className='button-link button-link-white' to='/'>
              Token Manager
            </Link>
          </Typography>
          <Link className='button-link button-link-white' to='/login'>
            Login
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavigationBar;

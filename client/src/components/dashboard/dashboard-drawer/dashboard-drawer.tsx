import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

function DashboardDrawer() {
  return (
    <Drawer
      variant='permanent'
      sx={{
        marginTop: 60,
        width: 180,
        flexShrink: 0,
        zIndex: 1,
        [`& .MuiDrawer-paper`]: {
          width: 180,
          boxSizing: 'border-box',
          zIndex: 1,
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem key={'wallets'} disablePadding>
            <ListItemButton>
              <ListItemText>
                <Link to='/' className='button-link button-link-black'>
                  Wallets
                </Link>
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem key={'tokens'} disablePadding>
            <ListItemButton>
              <ListItemText>
                <Link to='/' className='button-link button-link-black'>
                  Tokens
                </Link>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key={'account'} disablePadding>
            <ListItemButton>
              <ListItemText>
                <Link to='/' className='button-link button-link-black'>
                  Account
                </Link>
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem key={'settings'} disablePadding>
            <ListItemButton>
              <ListItemText>
                <Link to='/' className='button-link button-link-black'>
                  Settings
                </Link>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default DashboardDrawer;

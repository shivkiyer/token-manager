import { NavLink } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';

function DashboardDrawer() {
  const isActiveLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'button-link button-link-black button-link-active'
      : 'button-link button-link-black';

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
          <NavLink to='/dashboard' className={isActiveLinkClass} end>
            <ListItem>
              <ListItemButton>
                <span>Wallets</span>
              </ListItemButton>
            </ListItem>
          </NavLink>
          <NavLink to='/dashboard/tokens' className={isActiveLinkClass} end>
            <ListItem>
              <ListItemButton>
                <span>Tokens</span>
              </ListItemButton>
            </ListItem>
          </NavLink>
        </List>
        <Divider />
        <List>
          <NavLink to='/dashboard/account' className={isActiveLinkClass} end>
            <ListItem>
              <ListItemButton>
                <span>Account</span>
              </ListItemButton>
            </ListItem>
          </NavLink>
          <NavLink to='/dashboard/settings' className={isActiveLinkClass} end>
            <ListItem>
              <ListItemButton>
                <span>Settings</span>
              </ListItemButton>
            </ListItem>
          </NavLink>
        </List>
      </Box>
    </Drawer>
  );
}

export default DashboardDrawer;

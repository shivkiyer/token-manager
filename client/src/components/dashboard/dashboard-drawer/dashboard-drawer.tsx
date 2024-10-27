import { NavLink, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';

function DashboardDrawer({
  hideDrawer,
}: {
  hideDrawer: (drawerState: false) => void;
}) {
  const {pathname: currentUrl} = useLocation();

  const isActiveLinkClass = (path: string) => {
    if (currentUrl.includes(path)) {
      return 'button-link button-link-black button-link-active';
    }
    return 'button-link button-link-black';
  };

  const handleClose = () => {
    hideDrawer(false);
  };

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
          <ListItem sx={{ display: 'block', textAlign: 'right' }}>
            <CloseIcon
              sx={{ fontSize: '2.5rem', cursor: 'pointer' }}
              onClick={handleClose}
            />
          </ListItem>

          <NavLink
            to='/dashboard/wallet/list'
            className={() => isActiveLinkClass('/dashboard/wallet')}
            end
          >
            <ListItem>
              <ListItemButton>
                <span>Wallets</span>
              </ListItemButton>
            </ListItem>
          </NavLink>
          <NavLink to='/dashboard/tokens'
          className={() => isActiveLinkClass('/dashboard/tokens')}
          end
          >
            <ListItem>
              <ListItemButton>
                <span>Tokens</span>
              </ListItemButton>
            </ListItem>
          </NavLink>
        </List>
        <Divider />
        <List>
          <NavLink
            to='/dashboard/account/list'
            className={() => isActiveLinkClass('/dashboard/account')}
            end
          >
            <ListItem>
              <ListItemButton>
                <span>Account</span>
              </ListItemButton>
            </ListItem>
          </NavLink>
          <NavLink to='/dashboard/settings'
          className={() => isActiveLinkClass('/dashboard/settings')}
          end
          >
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

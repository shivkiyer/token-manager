'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function DashboardDrawer() {
  const currentUrl = usePathname();
  const [displayDashboardDrawer, setDisplayDashboardDrawer] =
    useState<boolean>(true);

  const isActiveLinkClass = (path: string, full: boolean = false) => {
    if (currentUrl.includes(path)) {
      return !full
        ? 'button-link button-link-black button-link-active'
        : currentUrl === path
        ? 'button-link button-link-black button-link-active'
        : 'button-link button-link-black';
    }
    return 'button-link button-link-black';
  };

  const handleClose = () => {
    setDisplayDashboardDrawer(false);
  };

  const handleOpen = () => {
    setDisplayDashboardDrawer(true);
  };

  return (
    <>
      <Grid container>
        <Grid size={12}>
          <KeyboardArrowRightIcon
            sx={{
              visibility: displayDashboardDrawer ? 'hidden' : 'visible',
              fontSize: '3.5rem',
              cursor: 'pointer',
            }}
            onClick={handleOpen}
          />
        </Grid>
      </Grid>
      <Drawer
        open={displayDashboardDrawer}
        onClose={handleClose}
        sx={{
          marginTop: 30,
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

            <Link
              href='/dashboard'
              className={isActiveLinkClass('/dashboard', true)}
            >
              <ListItem>
                <ListItemButton>
                  <Typography variant='button'>Overview</Typography>
                </ListItemButton>
              </ListItem>
            </Link>
            <Link
              href='/dashboard/wallet/list'
              className={isActiveLinkClass('/dashboard/wallet')}
            >
              <ListItem>
                <ListItemButton>
                  <Typography variant='button'>Wallets</Typography>
                </ListItemButton>
              </ListItem>
            </Link>
            <Link
              href='/dashboard/tokens'
              className={isActiveLinkClass('/dashboard/tokens')}
            >
              <ListItem>
                <ListItemButton>
                  <Typography variant='button'>Tokens</Typography>
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
          <Divider />
          <List>
            <Link
              href='/dashboard/account/list'
              className={isActiveLinkClass('/dashboard/account')}
            >
              <ListItem>
                <ListItemButton>
                  <Typography variant='button'>Account</Typography>
                </ListItemButton>
              </ListItem>
            </Link>
            <Link
              href='/dashboard/settings'
              className={isActiveLinkClass('/dashboard/settings')}
            >
              <ListItem>
                <ListItemButton>
                  <Typography variant='button'>Settings</Typography>
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default DashboardDrawer;

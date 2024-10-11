import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import DashboardDrawer from './dashboard-drawer/dashboard-drawer';

function Dashboard() {
  const [displayDrawer, setDisplayDrawer] = useState(true);

  const openDrawerHandler = () => {
    setDisplayDrawer(true);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {displayDrawer && <DashboardDrawer hideDrawer={setDisplayDrawer} />}
      <Box component='main' sx={{ flexGrow: 1, p: 2 }}>
        <Toolbar />
        {!displayDrawer && (
          <KeyboardArrowRightIcon
            sx={{ fontSize: '2.5rem', cursor: 'pointer' }}
            onClick={openDrawerHandler}
          />
        )}
        <Outlet></Outlet>
      </Box>
    </Box>
  );
}

export default Dashboard;

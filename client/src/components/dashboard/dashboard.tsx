import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import DashboardDrawer from './dashboard-drawer/dashboard-drawer';

function Dashboard() {
  return (
    <Box sx={{ display: 'flex' }}>
      <DashboardDrawer />
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet></Outlet>
      </Box>
    </Box>
  );
}

export default Dashboard;

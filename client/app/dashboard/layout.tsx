import Box from '@mui/material/Box';

import DashboardDrawer from '@/components/page-sections/dashboard-drawer/dashboard-drawer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex' }}>
      <DashboardDrawer />
      {children}
    </Box>
  );
}

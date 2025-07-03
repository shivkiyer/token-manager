import { redirect } from 'next/navigation';
import Box from '@mui/material/Box';

import { getSession } from '@/actions/auth/session';
import DashboardDrawer from '@/components/page-sections/dashboard-drawer/dashboard-drawer';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getSession();
  if (!token) {
    redirect('/login');
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <DashboardDrawer />
      {children}
    </Box>
  );
}

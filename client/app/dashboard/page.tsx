import { redirect } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { getSession } from '@/actions/auth/session';

export default async function Dashboard() {
  const token = await getSession();
  if (!token) {
    redirect('/login');
  }

  return (
    <Container>
      <Box>
        <Grid container>
          <Grid size={{ xs: 12 }}>
            <Typography variant='body1'>Dashboard</Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

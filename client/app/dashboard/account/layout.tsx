import Grid from '@mui/material/Grid';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box className='content-display' sx={{ flexGrow: 1 }}>
      <Grid
        className='nav-bar-options'
        container
        sx={{ marginBottom: '20px', padding: '8px' }}
      >
        <Grid size={6}>
          <Button>
            <Link
              href='/dashboard/account/list'
              className='button-link button-link-black'
            >
              <Typography variant='button'>List</Typography>
            </Link>
          </Button>
        </Grid>
        <Grid size={6}>
          <Button>
            <Link
              href='/dashboard/account/create'
              className='button-link button-link-black'
            >
              <Typography variant='button'>Create</Typography>
            </Link>
          </Button>
        </Grid>
      </Grid>

      {children}
    </Box>
  );
}

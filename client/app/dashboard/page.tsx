import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default async function Dashboard() {
  return (
    <Container>
      <Box>
        <Grid container>
          <Grid size={{ xs: 12 }} sx={{ marginTop: '30px' }}>
            <Typography variant='h4'>Account overview/dashboard</Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

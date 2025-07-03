import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Dashboard() {
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

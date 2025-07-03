import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function Homepage() {
  return (
    <Grid
      container
      direction='row'
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      marginTop={10}
    >
      <Grid size={{ xs: 10, md: 6 }}>
        <Typography variant='h4' component='h4'>
          Homepage to be designed later. Using Login link in app bar to get
          started.
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Homepage;

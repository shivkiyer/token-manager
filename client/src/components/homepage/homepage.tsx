import Grid from '@mui/material/Grid';

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
      <Grid item xs={10} md={6}>
        <h2>
          Homepage to be designed later. Using Login link in app bar to get started.
        </h2>
      </Grid>
    </Grid>
  );
}

export default Homepage;

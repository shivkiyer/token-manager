import { useRouteError } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import NavigationBar from '../navigation-bar/navigation-bar';

function ErrorPage() {
  const errorData: any = useRouteError();

  let message = 'The requested page could not be found.';
  if (
    errorData !== undefined &&
    errorData !== null &&
    errorData.message !== null
  ) {
    message = errorData.message;
  }

  return (
    <>
      <NavigationBar />
      <Container>
        <Grid item xs={12} marginTop={20}>
          <h3 style={{ textAlign: 'center' }}>{message}</h3>
        </Grid>
      </Container>
    </>
  );
}

export default ErrorPage;

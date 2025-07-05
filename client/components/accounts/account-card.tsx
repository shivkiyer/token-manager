import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import formatEthAddress from '@/utils/web3/formatEthAddress';

function AccountCard({
  id,
  name,
  address,
}: {
  id: number;
  name: string;
  address: string;
}) {
  return (
    <Grid container marginTop={3} marginLeft={2}>
      <Grid size={{ xs: 11, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant='h5'>{name}</Typography>
            <Typography variant='body1'>{formatEthAddress(address)}</Typography>
          </CardContent>
          <CardActions>
            <Button variant='contained' disabled={true}>
              <Typography variant='button'>Details</Typography>
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}

export default AccountCard;

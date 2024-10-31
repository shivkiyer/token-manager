import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import formatEthAddress from '../../../utils/web3/formatEthAddress';

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
    <Grid container marginTop={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <h4 style={{ marginBottom: '12px' }}>{name}</h4>
            <p>{formatEthAddress(address)}</p>
          </CardContent>
          <CardActions>
            <Button variant='contained' disabled={true}>
              Details
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}

export default AccountCard;

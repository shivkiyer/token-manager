import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import formatEthAddress from '../../../utils/web3/formatEthAddress';

interface WalletData {
  id: number;
  name: string;
  description: string;
  address: string;
  maxLimit: number;
}

function WalletCard({ id, name, description, address, maxLimit }: WalletData) {
  return (
    <Grid container marginTop={3} key={id}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent style={{ lineHeight: '1.5' }}>
            <h4 style={{ marginBottom: '12px' }}>{name}</h4>
            <p>{description}</p>
            <p>
              <strong>Address: </strong>
              {formatEthAddress(address)}
            </p>
            <p>
              <strong>Maximum withdrawal limit (Ether): </strong>
              {maxLimit}
            </p>
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

export default WalletCard;

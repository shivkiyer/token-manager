import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import formatEthAddress from '@/utils/web3/formatEthAddress';

interface WalletData {
  id: number;
  name: string;
  description: string;
  address: string;
  maxLimit: number;
  isOwner: boolean;
}

function WalletCard({
  id,
  name,
  description,
  address,
  maxLimit,
  isOwner,
}: WalletData) {
  return (
    <Grid container marginTop={3} key={id}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent style={{ lineHeight: '1.5' }}>
            <Typography variant='h6' sx={{ marginBottom: '12px' }}>
              {name}
            </Typography>
            <Typography variant='body1'>{description}</Typography>
            <Typography variant='body1'>
              <strong>Address: </strong>
              {formatEthAddress(address)}
            </Typography>
            <Typography variant='body1'>
              <strong>Maximum withdrawal limit (Ether): </strong>
              {maxLimit}
            </Typography>
          </CardContent>
          <CardActions>
            {isOwner ? (
              <Link href={`/dashboard/wallet/manage/${id}`}>
                <Button className='button-alert' variant='contained'>
                  <Typography variant='button'>Manage</Typography>
                </Button>
              </Link>
            ) : (
              <Link href={`/dashboard/wallet/access/${id}`}>
                <Button variant='contained'>
                  <Typography variant='button'>Access</Typography>
                </Button>
              </Link>
            )}
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}

export default WalletCard;

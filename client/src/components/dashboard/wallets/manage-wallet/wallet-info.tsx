import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';

import formatEthAddress from '../../../../utils/web3/formatEthAddress';

function WalletInfo({ web3, wallet }: { web3: any; wallet: any }) {
  return (
    <>
      <Grid item xs={12}>
        <h2 style={{ display: 'inline-block' }}>{wallet.name}</h2>
        <Button sx={{ padding: '0px', verticalAlign: 'top', marginTop: '4px' }}>
          <EditIcon />
        </Button>
      </Grid>

      <Grid item xs={12} marginTop={2}>
        <p>
          <strong>Account owner: </strong>
          {formatEthAddress(wallet.owner.address)}
        </p>
      </Grid>

      <Grid item xs={12} marginTop={2}>
        <p>
          <strong>Max withdrawal limit: </strong>
          {wallet.maxLimit} Ether
        </p>
      </Grid>

      <Grid item xs={12} marginTop={2}>
        <p>
          <strong>Description: </strong>
          {wallet.description !== null ? wallet.description : 'Not provided'}
        </p>
      </Grid>
    </>
  );
}

export default WalletInfo;

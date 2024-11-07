import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import DepositEther from './deposit-ether';

function ManageWallet() {
  const [displayDepositEther, setDisplayDepositEther] = useState(false);

  const showDisplayDepositEther = () => {
    setDisplayDepositEther(true);
  };

  const hideDisplayDepositEther = () => {
    setDisplayDepositEther(false);
  };

  return (
    <Box className='standard-box-display'>
      <Grid container>
        <Grid item xs={12}>
          <h2>Wallet name</h2>
        </Grid>

        <Grid item xs={12} marginTop={3}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus
            praesentium, a laudantium, asperiores blanditiis impedit soluta
            veritatis nisi ad in iste culpa! Magnam eum exercitationem incidunt
            quasi, eius officiis debitis?
          </p>
        </Grid>

        <Grid item xs={12} marginTop={3}>
          <h4 style={{ display: 'inline-block' }}>
            Current balance: 6.5 Ether
          </h4>
          <Button
            variant='contained'
            sx={{ marginLeft: '16px' }}
            onClick={showDisplayDepositEther}
          >
            Deposit Ether
          </Button>
        </Grid>

        {displayDepositEther && (
          <DepositEther hideDisplayDepositEther={hideDisplayDepositEther} />
        )}
      </Grid>
    </Box>
  );
}

export default ManageWallet;

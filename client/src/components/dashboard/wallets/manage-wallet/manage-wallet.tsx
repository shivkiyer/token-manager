import { useState, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { clearToken } from '../../../../utils/auth/auth';
import DepositEther from './deposit-ether';

function ManageWallet() {
  const [error, setError] = useState<string | null>(null);
  const walletData: any = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (walletData === null || walletData === undefined) {
        Object.assign(new Error());
      } else if (walletData.message !== undefined) {
        setError(walletData.message);
      } else if (
        (walletData.data === null || walletData.data === undefined) &&
        !walletData.ok
      ) {
        clearToken();
        navigate('/login');
      }
    } catch (e) {
      setError('Unable to fetch wallet');
    }
  }, [walletData, navigate]);

  return (
    <>
      {error !== null ? (
        <h3>{error}</h3>
      ) : (
        <Box className='standard-box-display'>
          <Grid container>
            <Grid item xs={12}>
              <h2>{walletData.data.name}</h2>
            </Grid>

            <Grid item xs={12} marginTop={3}>
              <p>
                {walletData.data.description !== null
                  ? walletData.data.description
                  : 'Not provided'}
              </p>
            </Grid>

            <DepositEther />
          </Grid>
        </Box>
      )}
    </>
  );
}

export default ManageWallet;

import { useState, useEffect, useContext } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { Web3Context } from './../../../../app/context/web3-context-provider';
import { clearToken } from '../../../../utils/auth/auth';
import WalletsHome from '../wallets-home';
import WalletInfo from '../wallet-info';
import UsersTable from '../users-table';
import WithdrawEther from './withdraw-ether';

function AccessWallet() {
  const [error, setError] = useState<string | null>(null);
  const walletData: any = useLoaderData();
  const navigate = useNavigate();
  const { web3, sharedWalletAbi } = useContext(Web3Context);

  useEffect(() => {
    setError(null);
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
      if (
        walletData.data.address === null ||
        walletData.data.address === undefined ||
        sharedWalletAbi === null ||
        sharedWalletAbi === undefined
      ) {
        setError('Wallet could not be fetched');
        return;
      }
      walletData.data.abi = sharedWalletAbi;
    } catch (e) {
      setError('Unable to fetch wallet');
    }
  }, [walletData, sharedWalletAbi, navigate]);

  return (
    <>
      <WalletsHome />
      {error !== null ? (
        <h3 style={{ marginTop: '20px' }}>{error}</h3>
      ) : (
        <Box className='standard-box-display' marginTop={4}>
          <Grid container>
            <WalletInfo web3={web3} wallet={walletData.data} editable={false} />
            <Grid item xs={12} md={10} marginTop={2} marginBottom={2}>
              <h4>Wallet Users:</h4>
            </Grid>
            <UsersTable users={walletData.data.user} form={null} />
          </Grid>

          <WithdrawEther web3={web3} wallet={walletData.data} />
        </Box>
      )}
    </>
  );
}

export default AccessWallet;

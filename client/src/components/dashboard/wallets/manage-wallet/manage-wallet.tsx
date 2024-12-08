import { useState, useEffect, useContext } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { Web3Context } from './../../../../app/context/web3-context-provider';
import { clearToken } from '../../../../utils/auth/auth';
import DepositEther from './deposit-ether';
import WalletUsers from './wallet-users';
import WalletInfo from '../wallet-info';
import WalletsHome from '../wallets-home';

function ManageWallet() {
  const [error, setError] = useState<string | null>(null);
  const walletData: any = useLoaderData();
  const navigate = useNavigate();
  const { web3, sharedWalletAbi } = useContext(Web3Context);

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

  useEffect(() => {
    setError(null);
    if (web3 === null || web3 === undefined) {
      setError('Metamask needs to be unlocked to manage the wallet');
      return;
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
  }, [web3, walletData, sharedWalletAbi]);

  return (
    <>
      <WalletsHome />
      {error !== null ? (
        <h3 style={{ marginTop: '20px' }}>{error}</h3>
      ) : (
        <Box className='standard-box-display' marginTop={4}>
          <Grid container>
            <WalletInfo web3={web3} wallet={walletData.data} />
            <DepositEther web3={web3} wallet={walletData.data} />
            <WalletUsers web3={web3} wallet={walletData.data} />
          </Grid>
        </Box>
      )}
    </>
  );
}

export default ManageWallet;

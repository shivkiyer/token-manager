'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

import getWalletDetails from '@/actions/wallet/getWalletDetails';
import getWeb3 from '@/utils/web3/web3';
import getSharedWalletData from '@/actions/contract-factory/getSharedWalletAbi';

import WalletsHome from '@/components/wallets/wallets-home';
import WalletInfo from '@/components/wallets/wallet-info';
import DepositEther from '@/components/wallets/deposit-ether';
import WalletUsers from '@/components/wallets/wallet-users';

function ManageWallet() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [walletData, setWalletData] = useState<any>(null);
  const [web3, setWeb3] = useState<any>(null);
  const [sharedWalletAbi, setSharedWalletAbi] = useState<any>(null);
  const { walletId } = useParams<{ walletId: string }>();

  useEffect(() => {
    const getData = async () => {
      const web3Obj = await getWeb3();
      setWeb3(web3Obj);
      const data = await getWalletDetails(walletId);
      setWalletData(data);
      const abi = await getSharedWalletData('get-abi');
      setSharedWalletAbi(abi);
      setLoading(false);
    };
    getData();
  }, []);

  useEffect(() => {
    setError(null);
    if (!web3) {
      setError('Metamask needs to be unlocked to manage the wallet');
      return;
    }

    if (
      !walletData ||
      !walletData.data ||
      !walletData.data.address ||
      !sharedWalletAbi ||
      !sharedWalletAbi.data
    ) {
      setError('Wallet could not be fetched');
      return;
    }
    walletData.data.abi = sharedWalletAbi.data;
  }, [web3, walletData, sharedWalletAbi]);

  return (
    <>
      <WalletsHome />
      {loading ? (
        <CircularProgress
          size={60}
          sx={{ marginTop: '100px', display: 'block' }}
        />
      ) : error !== null ? (
        <h3 style={{ marginTop: '20px' }}>{error}</h3>
      ) : (
        <Box className='standard-box-display' marginTop={4}>
          <Grid container>
            <WalletInfo web3={web3} wallet={walletData.data} editable={true} />
            <DepositEther web3={web3} wallet={walletData.data} />
            <WalletUsers web3={web3} wallet={walletData.data} />
          </Grid>
        </Box>
      )}
    </>
  );
}

export default ManageWallet;

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Wallet } from '@/interfaces/wallet';
import getWalletDetails from '@/actions/wallet/getWalletDetails';
import getWeb3 from '@/utils/web3/web3';
import getSharedWalletData from '@/actions/contract-factory/getSharedWalletAbi';

import LoadingSpinner from '@/components/page-sections/loading-spinner/loading-spinner';
import WalletsHome from '@/components/wallets/wallets-home';
import WalletInfo from '@/components/wallets/wallet-info';
import DepositEther from '@/components/wallets/deposit-ether';
import WalletUsers from '@/components/wallets/wallet-users';

function ManageWallet() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const [web3, setWeb3] = useState<any>(null);
  const [sharedWalletAbi, setSharedWalletAbi] = useState<any>(null);
  const { walletId } = useParams<{ walletId: string }>();

  useEffect(() => {
    const getData = async () => {
      const web3Obj = await getWeb3();
      setWeb3(web3Obj);
      const data = await getWalletDetails(walletId);
      setWalletData(data.data);
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
      !walletData.address ||
      !sharedWalletAbi ||
      !sharedWalletAbi.data
    ) {
      setError('Wallet could not be fetched');
      return;
    }
    walletData.abi = sharedWalletAbi.data;
  }, [web3, walletData, sharedWalletAbi]);

  return (
    <>
      <WalletsHome />
      {loading ? (
        <LoadingSpinner size={3} radius={60} top={40} />
      ) : error !== null ? (
        <Typography color='error' variant='body1' sx={{ marginTop: '20px' }}>
          {error}
        </Typography>
      ) : walletData ? (
        <Box marginTop={4}>
          <Grid container>
            <WalletInfo web3={web3} wallet={walletData} editable={true} />
            <DepositEther web3={web3} wallet={walletData} />
            <WalletUsers web3={web3} wallet={walletData} />
          </Grid>
        </Box>
      ) : null}
    </>
  );
}

export default ManageWallet;

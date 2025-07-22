'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Wallet } from '@/interfaces/wallet';
import getEthers from '@/utils/ethers/ethers';
import getWalletDetails from '@/actions/wallet/getWalletDetails';
import getSharedWalletData from '@/actions/contract-factory/getSharedWalletAbi';

import LoadingSpinner from '@/components/page-sections/loading-spinner/loading-spinner';
import WalletsHome from '@/components/wallets/wallets-home';
import WalletInfo from '@/components/wallets/wallet-info';
import UsersTable from '@/components/wallets/users-table';
import WithdrawEther from '@/components/wallets/withdraw-ether';

export default function AccessWallet() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ethers, setEthers] = useState<any>();
  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const [sharedWalletAbi, setSharedWalletAbi] = useState<any>(null);
  const { walletId } = useParams<{ walletId: string }>();

  useEffect(() => {
    const getData = async () => {
      const ethersObj = await getEthers();
      setEthers(ethersObj);
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
    if (!ethers) {
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
  }, [ethers, walletData, sharedWalletAbi]);

  return (
    <>
      <WalletsHome />
      {loading ? (
        <LoadingSpinner size={3} radius={60} top={40} />
      ) : error !== null ? (
        <Typography color='error' variant='body1' sx={{ marginTop: '20px' }}>
          {error}
        </Typography>
      ) : (
        <Box className='standard-box-display' marginTop={4}>
          {walletData?.user && (
            <Grid container>
              <WalletInfo
                ethers={ethers}
                wallet={walletData}
                editable={false}
              />
              <Grid size={{ xs: 12, md: 10 }} marginTop={2} marginBottom={2}>
                <Typography variant='h6'>Wallet Users:</Typography>
              </Grid>
              <UsersTable users={walletData.user} form={null} />
            </Grid>
          )}

          {walletData && <WithdrawEther ethers={ethers} wallet={walletData} />}
        </Box>
      )}
    </>
  );
}

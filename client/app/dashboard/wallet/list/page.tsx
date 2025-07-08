'use client';

import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

import fetchWallets from '@/actions/wallet/fetchWallets';
import WalletCard from '@/components/wallets/wallet-card';
import LoadingSpinner from '@/components/page-sections/loading-spinner/loading-spinner';

function ListWallets() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<any>(null);

  useEffect(() => {
    const getWallets = async () => {
      const wallets = await fetchWallets();
      if (wallets.message) {
        setError(wallets.message);
        setWalletData(null);
      } else {
        setWalletData(wallets.data);
        setError(null);
      }
      setLoading(false);
    };
    getWallets();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner size={3} radius={60} />
      ) : error ? (
        <Typography color='error' variant='h6'>
          {error}
        </Typography>
      ) : walletData?.length > 0 ? (
        walletData.map((wallet: any) => (
          <WalletCard
            key={wallet.id}
            id={wallet.id}
            name={wallet.name}
            description={wallet.description}
            maxLimit={wallet.maxLimit}
            address={wallet.address}
            isOwner={wallet.isOwner}
          ></WalletCard>
        ))
      ) : (
        <Typography variant='h6'>
          No wallets found. Use the CREATE button to create a wallet.
        </Typography>
      )}
    </>
  );
}

export default ListWallets;

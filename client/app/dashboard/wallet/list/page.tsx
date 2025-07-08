'use server';

import { Suspense } from 'react';
import Typography from '@mui/material/Typography';

import fetchWallets from '@/actions/wallet/fetchWallets';
import WalletCard from '@/components/wallets/wallet-card';
import LoadingSpinner from '@/components/page-sections/loading-spinner/loading-spinner';

export default async function ListWallets() {
  let error: string | null = null;
  let walletData: any = null;

  const getWallets = async () => {
    const wallets = await fetchWallets();
    if (wallets.message) {
      error = wallets.message;
      walletData = null;
    } else {
      walletData = wallets.data;
      error = null;
    }
  };
  await getWallets();

  return (
    <>
      <Suspense fallback={<LoadingSpinner size={3} radius={60} />}></Suspense>
      {error ? (
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
        <Typography variant='h6' textAlign='center'>
          No wallets found. Use the CREATE button to create a wallet.
        </Typography>
      )}
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

import fetchWallets from '@/actions/wallet/fetchWallets';
import WalletCard from '@/components/wallets/wallet-card';

function ListWallets() {
  const [walletData, setWalletData] = useState<any>(null);

  useEffect(() => {
    const getWallets = async () => {
      const wallets = await fetchWallets();
      setWalletData(wallets);
    };
    getWallets();
  }, []);

  return (
    <>
      {walletData !== null &&
      walletData.data !== undefined &&
      walletData.data.length > 0 ? (
        walletData.data.map((wallet: any) => (
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

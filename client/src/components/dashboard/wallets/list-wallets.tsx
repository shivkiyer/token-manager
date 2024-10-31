import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import WalletCard from './wallet-card';

function ListWallets() {
  const walletData: any = useLoaderData();
  const [error, setError] = useState<string | null>(null);

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
        Object.assign(new Error());
      }
    } catch (e) {
      setError('Unable to fetch wallets');
    }
  }, [walletData]);

  return (
    <>
      {walletData !== null && walletData.data !== undefined ? (
        walletData.data.map((wallet: any) => (
          <WalletCard
            key={wallet.id}
            id={wallet.id}
            name={wallet.name}
            description={wallet.description}
            maxLimit={wallet.maxLimit}
            address={wallet.address}
          ></WalletCard>
        ))
      ) : (
        <h3>{error}</h3>
      )}
    </>
  );
}

export default ListWallets;

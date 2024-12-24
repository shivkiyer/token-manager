import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { clearToken } from '../../../../utils/auth/auth';
import WalletCard from './../wallet-card';

function ListWallets() {
  const walletData: any = useLoaderData();
  const navigate = useNavigate();
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
        clearToken();
        navigate('/login');
      } else if (walletData.data.length === 0) {
        setError(
          'No wallets found. Use the CREATE tab to create a new wallet.'
        );
      }
    } catch (e) {
      setError('Unable to fetch wallets');
    }
  }, [walletData, navigate]);

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
        <h4>{error}</h4>
      )}
    </>
  );
}

export default ListWallets;

'use client';

import { useEffect, useState } from 'react';

import accountsListLoader from '@/actions/account/accountListLoader';
import AccountCard from '@/components/accounts/account-card';
import LoadingSpinner from '@/components/page-sections/loading-spinner/loading-spinner';

interface AccountData {
  data: any;
  message?: string;
  ok?: boolean;
}

function ListAccounts() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<AccountData | null>(null);

  useEffect(() => {
    const getAccounts = async () => {
      const accountData = await accountsListLoader();
      if (accountData === null) {
        setError('Unable to fetch accounts.');
      } else if (accountData.message !== undefined) {
        setError(accountData.message);
      } else if (accountData.data) {
        setAccounts(accountData);
      }
      setLoading(false);
    };
    getAccounts();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner size={3} radius={60} />
      ) : accounts && accounts.data ? (
        accounts.data.map((item: any) => (
          <AccountCard
            key={item.accountId}
            id={item.accountId}
            name={item.accountName}
            address={item.accountAddress}
          ></AccountCard>
        ))
      ) : (
        <h4>{error}</h4>
      )}
    </>
  );
}

export default ListAccounts;

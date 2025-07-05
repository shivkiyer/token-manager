'use client';

import { useEffect, useState } from 'react';

import accountsListLoader from '@/actions/eth/accountListLoader';
import AccountCard from '@/components/accounts/account-card';

interface AccountData {
  data: any;
  message?: string;
  ok?: boolean;
}

function ListAccounts() {
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
    };
    getAccounts();
  }, []);

  return (
    <>
      {accounts && accounts.data ? (
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

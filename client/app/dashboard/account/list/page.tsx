'use server';

import { Suspense } from 'react';
import Typography from '@mui/material/Typography';

import Account from '@/interfaces/account';
import accountsListLoader from '@/actions/account/accountListLoader';
import AccountCard from '@/components/accounts/account-card';
import LoadingSpinner from '@/components/page-sections/loading-spinner/loading-spinner';

export default async function ListAccounts() {
  let error: string | null = null;
  let accounts: Account[] = [];

  const getAccounts = async () => {
    const accountData = await accountsListLoader();
    if (accountData.message) {
      error = accountData.message;
    } else if (accountData.data) {
      accounts = accountData.data;
    }
  };
  await getAccounts();

  return (
    <>
      <Suspense fallback={<LoadingSpinner size={3} radius={60} />}></Suspense>
      {error ? (
        <Typography color='error' variant='h6'>
          {error}
        </Typography>
      ) : accounts?.length > 0 ? (
        accounts?.map((item: Account) => (
          <AccountCard
            key={item.accountId}
            id={item.accountId}
            name={item.accountName}
            address={item.accountAddress}
          ></AccountCard>
        ))
      ) : (
        <Typography variant='h6' textAlign='center'>
          No accounts found. Use the CREATE button to link an account.
        </Typography>
      )}
    </>
  );
}

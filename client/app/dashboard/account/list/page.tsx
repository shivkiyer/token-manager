'use server';

import { Suspense } from 'react';
import Typography from '@mui/material/Typography';

import accountsListLoader from '@/actions/account/accountListLoader';
import AccountCard from '@/components/accounts/account-card';
import LoadingSpinner from '@/components/page-sections/loading-spinner/loading-spinner';

export default async function ListAccounts() {
  let error: string | null = null;
  let accounts: any;

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
      ) : (
        accounts?.map((item: any) => (
          <AccountCard
            key={item.accountId}
            id={item.accountId}
            name={item.accountName}
            address={item.accountAddress}
          ></AccountCard>
        ))
      )}
    </>
  );
}

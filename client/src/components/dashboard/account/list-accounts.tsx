import { useLoaderData } from 'react-router-dom';
import AccountCard from './account-card';

interface AccountData {
  data: any;
  message?: string;
}

function ListAccounts() {
  const accounts: AccountData = useLoaderData() as AccountData;
  let error: string | null = null;
  if (accounts === null) {
    error = 'Unable to fetch accounts';
  }
  if (accounts.message !== undefined) {
    error = accounts.message;
  }

  return (
    <>
      {accounts.data !== undefined ? (
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

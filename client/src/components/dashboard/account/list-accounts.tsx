import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import AccountCard from './account-card';

interface AccountData {
  data: any;
  message?: string;
  ok?: boolean;
}

function ListAccounts() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const accounts: AccountData = useLoaderData() as AccountData;

  useEffect(() => {
    if (accounts === null) {
      setError('Unable to fetch accounts.');
    } else if (accounts.message !== undefined) {
      setError(accounts.message);
    } else if (
      (accounts.data === null || accounts.data === undefined) &&
      !accounts.ok
    ) {
      navigate('/login');
    }
  }, [accounts, error, navigate]);

  return (
    <>
      {accounts !== null && accounts.data !== undefined ? (
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

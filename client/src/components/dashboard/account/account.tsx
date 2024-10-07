import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import ListAccounts from './list-accounts';
import RegisterAccount from './register-account';

import useTokenAuthentication from '../../../hooks/useTokenAuthentication';

function Account() {
  const userToken = useTokenAuthentication();
  const [registerAccount, setRegisterAccount] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setRegisterAccount(newValue);
  };

  return (
    <>
      <Tabs
        value={registerAccount}
        onChange={handleChange}
        aria-label='basic tabs example'
      >
        <Tab label='LIST' />
        <Tab label='CREATE' />
      </Tabs>
      <Box sx={{ mt: 5 }}>
        {registerAccount ? <RegisterAccount /> : <ListAccounts />}
      </Box>
    </>
  );
}

export default Account;

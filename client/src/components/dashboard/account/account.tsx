import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import useTokenAuthentication from '../../../hooks/useTokenAuthentication';

function Account() {
  const userToken = useTokenAuthentication();
  const [registerAccount, setRegisterAccount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard/account/list');
  }, [navigate]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setRegisterAccount(newValue);
    if (newValue) {
      navigate('/dashboard/account/create');
    } else {
      navigate('/dashboard/account/list');
    }
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
        <Outlet></Outlet>
      </Box>
    </>
  );
}

export default Account;

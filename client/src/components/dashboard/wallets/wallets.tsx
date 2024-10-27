import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import useTokenAuthentication from '../../../hooks/useTokenAuthentication';

function Wallets() {
  const { pathname } = useLocation();
  const userToken = useTokenAuthentication();

  const [registerWallet, setRegisterWallet] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname.includes('create')) {
      setRegisterWallet(1);
      navigate('/dashboard/wallet/create');
    } else {
      setRegisterWallet(0);
      navigate('/dashboard/wallet/list');
    }
  }, [pathname, navigate, setRegisterWallet]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setRegisterWallet(newValue);
    if (newValue) {
      navigate('/dashboard/wallet/create');
    } else {
      navigate('/dashboard/wallet/list');
    }
  };

  return (
    <>
      <Tabs
        value={registerWallet}
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

export default Wallets;

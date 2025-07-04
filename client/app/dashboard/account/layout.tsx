'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [registerAccount, setRegisterAccount] = useState<number>(0);

  useEffect(() => {
    if (pathname.includes('create')) {
      setRegisterAccount(1);
      router.push('/dashboard/account/create');
    } else {
      setRegisterAccount(0);
      router.push('/dashboard/account/list');
    }
  }, [pathname, setRegisterAccount, router]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setRegisterAccount(newValue);
    if (newValue) {
      router.push('/dashboard/account/create');
      return;
    } else {
      router.push('/dashboard/account/list');
    }
  };

  return (
    <>
      <Tabs
        value={registerAccount}
        onChange={handleChange}
        aria-label='account choices'
      >
        <Tab label='LIST' />
        <Tab label='CREATE' />
      </Tabs>
      <Box sx={{ mt: 5 }}>{children}</Box>
    </>
  );
}

import { useState, useEffect, useContext, useCallback } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

import { Web3Context } from './../../../../app/context/web3-context-provider';
import { clearToken } from '../../../../utils/auth/auth';
import WalletsHome from '../wallets-home';
import WalletInfo from '../wallet-info';
import UsersTable from '../users-table';

function AccessWallet() {
  const [error, setError] = useState<string | null>(null);
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const walletData: any = useLoaderData();
  const navigate = useNavigate();
  const { web3, sharedWalletAbi } = useContext(Web3Context);

  useEffect(() => {
    try {
      if (walletData === null || walletData === undefined) {
        Object.assign(new Error());
      } else if (walletData.message !== undefined) {
        setError(walletData.message);
      } else if (
        (walletData.data === null || walletData.data === undefined) &&
        !walletData.ok
      ) {
        clearToken();
        navigate('/login');
      }
    } catch (e) {
      setError('Unable to fetch wallet');
    }
  }, [walletData, navigate]);

  const fetchActiveAccount = useCallback(async () => {
    if (web3 !== null && web3 !== undefined) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setActiveAccount(accounts[0]);
        setAccountError(null);
      } else {
        setAccountError('No linked Metamask account found');
      }
    }
  }, [web3]);

  const verifyAccountAccess = useCallback(async () => {
    if (web3 !== null && web3 !== undefined) {
      await fetchActiveAccount();

      const userAccounts = walletData.data.user.map(
        (item: { id: number; address: string; name: string }) => item.address
      );
      if (activeAccount !== null && !userAccounts.includes(activeAccount)) {
        setAccountError('Linked Metamask account is not a wallet user');
      }
    }
  }, [web3, walletData, activeAccount, fetchActiveAccount]);

  useEffect(() => {
    setError(null);
    if (web3 === null || web3 === undefined) {
      setError('Metamask needs to be unlocked to manage the wallet');
      return;
    }

    if (
      walletData.data.address === null ||
      walletData.data.address === undefined ||
      sharedWalletAbi === null ||
      sharedWalletAbi === undefined
    ) {
      setError('Wallet could not be fetched');
      return;
    }
    walletData.data.abi = sharedWalletAbi;

    verifyAccountAccess();
  }, [web3, walletData, sharedWalletAbi, activeAccount, verifyAccountAccess]);

  return (
    <>
      <WalletsHome />
      {error !== null ? (
        <h3 style={{ marginTop: '20px' }}>{error}</h3>
      ) : (
        <Box className='standard-box-display' marginTop={4}>
          <Grid container>
            <WalletInfo web3={web3} wallet={walletData.data} />
            <Grid item xs={12} md={10} marginTop={2} marginBottom={2}>
              <h4>Wallet Users:</h4>
            </Grid>
            <UsersTable users={walletData.data.user} form={null} />

            {accountError && (
              <>
                <Grid item xs={12} md={10} marginTop={1}>
                  <p className='error-message' style={{ textAlign: 'left' }}>
                    {accountError}
                  </p>
                </Grid>
                <Grid item xs={9} md={7} paddingTop={0.5}>
                  <p>Change the Metamask account and click on refresh</p>
                </Grid>
                <Grid item xs={3} md={3}>
                  <Button sx={{ padding: '0px' }} onClick={verifyAccountAccess}>
                    <RefreshIcon />
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      )}
    </>
  );
}

export default AccessWallet;

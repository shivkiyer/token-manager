import { useState, useEffect, useContext } from 'react';
import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Web3Context } from './../../../../app/context/web3-context-provider';
import { clearToken } from '../../../../utils/auth/auth';
import DepositEther from './deposit-ether';
import WalletUsers from './wallet-users';
import formatEthAddress from '../../../../utils/web3/formatEthAddress';

function ManageWallet() {
  const [error, setError] = useState<string | null>(null);
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
  }, [web3, walletData, sharedWalletAbi]);

  return (
    <>
      <Link
        to='/dashboard/wallet/list'
        className='button-link button-link-black'
        style={{ fontSize: '18px' }}
      >
        <ArrowBackIcon sx={{ paddingTop: '8px' }} />
        Back to wallets
      </Link>
      {error !== null ? (
        <h3 style={{ marginTop: '20px' }}>{error}</h3>
      ) : (
        <Box className='standard-box-display' marginTop={4}>
          <Grid container>
            <Grid item xs={12}>
              <h2>{walletData.data.name}</h2>
            </Grid>

            <Grid item xs={12} marginTop={2}>
              <p>
                <strong>Account owner: </strong>
                {formatEthAddress(walletData.data.owner.address)}
              </p>
            </Grid>

            <Grid item xs={12} marginTop={3}>
              <p>
                {walletData.data.description !== null
                  ? walletData.data.description
                  : 'Not provided'}
              </p>
            </Grid>

            <DepositEther web3={web3} wallet={walletData.data} />
            <WalletUsers wallet={walletData.data} />
          </Grid>
        </Box>
      )}
    </>
  );
}

export default ManageWallet;

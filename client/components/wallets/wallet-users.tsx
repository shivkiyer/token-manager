'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import getWalletUsers from '@/actions/wallet/getWalletUsers';
import removeWalletUsers from '@/actions/wallet/removeWalletUsers';
import searchWalletUsers from '@/actions/wallet/searchWalletUsers';
import addUserToWallet from '@/actions/wallet/addUsersToWallet';

import UsersTable from './users-table';

export default function WalletUsers({
  web3,
  wallet,
}: {
  web3: any;
  wallet: any;
}) {
  const [userData, setUserData] = useState<any>(null);
  const [searchData, setSearchData] = useState<any>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [removeUserError, setRemoveUserError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [displayForm, setDisplayForm] = useState(false);

  const fetchWalletUsers = useCallback(async () => {
    try {
      const response = await getWalletUsers(wallet.address);
      if (response.data) {
        setUserData(response.data);
      } else if (response.message) {
        setInitError(response.message);
      }
    } catch (e) {
      setInitError('Could not fetch wallet users');
    }
  }, [wallet]);

  useEffect(() => {
    if (web3 === null || web3 === undefined) {
      setInitError('Metamask needs to be unlocked');
    }
    fetchWalletUsers();
  }, [fetchWalletUsers, web3]);

  const removeUserHandler = async (values: any) => {
    try {
      setRemoveUserError(null);

      let web3Accounts: string[];
      let web3Account: string = '0x0';
      if (web3 !== null && web3 !== undefined) {
        web3Accounts = await web3.eth.getAccounts();
        web3Account = web3Accounts[0];

        if (wallet.owner.address !== web3Account) {
          setRemoveUserError('Linked Metamask account is not the wallet owner');
          return;
        }
      }

      let accAddresses: string[] = [];
      values.checked.forEach((item: string) => {
        for (let i = 0; i < userData.length; i++) {
          if (userData[i].id === Number(item)) {
            accAddresses.push(userData[i].address);
          }
        }
      });

      if (accAddresses.length === 0) {
        return setRemoveUserError('No account selected');
      }

      const response = await removeWalletUsers(wallet.address, accAddresses);

      if (response.message) {
        setRemoveUserError(response.message);
        return;
      }

      if (web3 !== null && web3 !== undefined) {
        const walletContract = new web3.eth.Contract(
          wallet.abi,
          wallet.address
        );
        const gasEstimate = await walletContract.methods
          .removeWithdrawers(accAddresses)
          .estimateGas({ from: web3Account });
        const actualGas = gasEstimate * BigInt(2);
        const web3Response = await walletContract.methods
          .removeWithdrawers(accAddresses)
          .send({ from: web3Account, gas: actualGas.toString() });

        if (
          web3Response.transactionHash === null ||
          web3Response.transactionHash === undefined
        ) {
          throw new Error();
        }
      }
      removeUserForm.values.checked = [];
      fetchWalletUsers();
    } catch (e) {
      setRemoveUserError('Could not remove wallet users');
    }
  };

  const removeUserForm = useFormik({
    initialValues: { checked: [] },
    onSubmit: (values: any) => removeUserHandler(values),
  });

  const addUserHandler = () => {
    setDisplayForm(true);
  };

  const hideAddUserHandler = () => {
    searchForm.values.search = '';
    searchResultsForm.values.checked = [];
    setSearchData(null);
    setDisplayForm(false);
  };

  const handleUsersSearch = async (values: any) => {
    try {
      const response = await searchWalletUsers(wallet.address, values.search);
      if (response.data) {
        setSearchData(response.data);
      } else if (response.message) {
        setSearchError(response.message);
      }
    } catch (e) {
      setSearchError('Could not find any accounts');
    }
  };

  const searchForm = useFormik({
    initialValues: {
      search: '',
    },
    onSubmit: (values) => handleUsersSearch(values),
  });

  const addUserToWalletHandler = async (values: any) => {
    try {
      setAddUserError(null);

      let web3Accounts: string[];
      let web3Account: string = '0x0';
      if (web3 !== null && web3 !== undefined) {
        web3Accounts = await web3.eth.getAccounts();
        web3Account = web3Accounts[0];

        if (wallet.owner.address !== web3Account) {
          setAddUserError('Linked Metamask account is not the wallet owner');
          return;
        }
      }

      let accAddresses: string[] = [];
      values.checked.forEach((item: string) => {
        for (let i = 0; i < searchData.length; i++) {
          if (searchData[i].id === Number(item)) {
            accAddresses.push(searchData[i].address);
          }
        }
      });

      if (accAddresses.length === 0) {
        return setAddUserError('No account selected');
      }

      const response = await addUserToWallet(wallet.address, accAddresses);

      if (response.message) {
        setAddUserError(response.message);
        return;
      }

      if (web3 !== null && web3 !== undefined) {
        const walletContract = new web3.eth.Contract(
          wallet.abi,
          wallet.address
        );

        const gasEstimate = await walletContract.methods
          .setWithdrawers(accAddresses)
          .estimateGas({ from: web3Account });

        const actualGas = gasEstimate * BigInt(2);
        const web3Response = await walletContract.methods
          .setWithdrawers(accAddresses)
          .send({ from: web3Account, gas: actualGas.toString() });

        if (
          web3Response.transactionHash === null ||
          web3Response.transactionHash === undefined
        ) {
          throw new Error();
        }
      }

      searchResultsForm.values.checked = [];
      fetchWalletUsers();
      hideAddUserHandler();
    } catch (e) {
      setAddUserError('Accounts could not be added to the wallet');
    }
  };

  const searchResultsForm = useFormik({
    initialValues: {
      checked: [],
    },
    onSubmit: (values) => addUserToWalletHandler(values),
  });

  let content: any;

  if (initError !== null) {
    content = <p>{initError}</p>;
  } else if (userData !== null) {
    if (userData.length === 0) {
      content = <p>This wallet has no users.</p>;
    } else {
      content = <UsersTable users={userData} form={removeUserForm} />;
    }
  }

  return (
    <>
      <Grid container marginTop={4} marginBottom={4}>
        <Grid size={{ xs: 12 }}>
          <Typography variant='h5'>Wallet users</Typography>
        </Grid>

        <form method='POST' onSubmit={removeUserForm.handleSubmit}>
          <Grid size={{ xs: 12 }} marginTop={3}>
            {content}
          </Grid>

          <Grid size={{ xs: 12 }} marginTop={1}>
            <Button variant='contained' onClick={addUserHandler}>
              <Typography variant='button'>Add Users</Typography>
            </Button>
            <Button
              variant='contained'
              color='error'
              type='submit'
              sx={{ marginLeft: '16px' }}
            >
              <Typography variant='button'>Remove Users</Typography>
            </Button>
          </Grid>
          {removeUserError && (
            <Grid size={{ xs: 12 }} marginTop={1}>
              <Typography
                color='error'
                variant='body1'
                sx={{ textAlign: 'left' }}
              >
                {removeUserError}
              </Typography>
            </Grid>
          )}
        </form>

        {displayForm && (
          <form
            method='GET'
            onSubmit={searchForm.handleSubmit}
            style={{ width: '100%' }}
          >
            <Grid container marginTop={3}>
              <Grid size={{ xs: 9 }}>
                <TextField
                  name='search'
                  variant='standard'
                  placeholder='Username or Account Name or Account Address'
                  value={searchForm.values.search}
                  onChange={searchForm.handleChange}
                  onBlur={searchForm.handleBlur}
                  fullWidth
                ></TextField>
              </Grid>
              <Grid size={{ xs: 3 }}>
                <Button
                  type='submit'
                  sx={{ marginLeft: '10px', padding: '0', minWidth: 'auto' }}
                >
                  <SearchIcon />
                </Button>
                <Button
                  onClick={hideAddUserHandler}
                  sx={{ marginLeft: '10px', padding: '0', minWidth: 'auto' }}
                >
                  <CloseIcon />
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

        {searchData && (
          <Grid container marginTop={4}>
            <Typography variant='h6'>Search results:</Typography>
            {searchError !== null ? (
              <Typography color='error' variant='body1'>
                {searchError}
              </Typography>
            ) : (
              <form
                method='POST'
                onSubmit={searchResultsForm.handleSubmit}
                style={{ display: 'block', width: '100%' }}
              >
                <UsersTable users={searchData} form={searchResultsForm} />

                <Grid size={{ xs: 12 }} marginTop={2}>
                  <Button variant='contained' type='submit'>
                    <Typography variant='button'>Add</Typography>
                    {/* Add */}
                  </Button>
                </Grid>
              </form>
            )}

            {addUserError && (
              <Grid size={{ xs: 12 }} marginTop={1}>
                <Typography
                  color='error'
                  variant='body1'
                  sx={{ textAlign: 'left' }}
                >
                  {addUserError}
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    </>
  );
}

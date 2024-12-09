import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import UsersTable from '../users-table';
import { authToken, clearToken } from '../../../../utils/auth/auth';
import apiCall from '../../../../utils/http/api-call';

function WalletUsers({ web3, wallet }: { web3: any; wallet: any }) {
  const [userData, setUserData] = useState<any>(null);
  const [searchData, setSearchData] = useState<any>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [removeUserError, setRemoveUserError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [displayForm, setDisplayForm] = useState(false);
  const navigate = useNavigate();
  const userToken = authToken();

  const fetchWalletUsers = useCallback(async () => {
    try {
      const authHeader = { Authorization: userToken || '' };
      const response = await apiCall(
        `${process.env.REACT_APP_BASE_API_URL}/api/wallets/${wallet.address}/get-users`,
        'GET',
        authHeader,
        null
      );
      const responseData = await response.json();
      if (
        response.ok &&
        responseData.data !== null &&
        responseData.data !== undefined
      ) {
        setUserData(responseData.data);
      } else if (
        !response.ok &&
        responseData.message !== null &&
        responseData.message !== undefined
      ) {
        if (responseData.message.includes('Authorization failed')) {
          clearToken();
          navigate('/login');
        }
        setInitError(responseData.message);
      }
    } catch (e) {
      setInitError('Could not fetch wallet users');
    }
  }, [userToken, wallet, navigate]);

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

      const authHeader = { Authorization: userToken || '' };
      const response = await apiCall(
        `${process.env.REACT_APP_BASE_API_URL}/api/wallets/${wallet.address}/remove-user`,
        'POST',
        authHeader,
        { accounts: accAddresses }
      );
      const responseData = await response.json();

      if (!response.ok) {
        if (
          responseData.message !== null &&
          responseData.message !== undefined
        ) {
          setRemoveUserError(responseData.message);
          return;
        }

        throw new Error();
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
      const authHeader = { Authorization: userToken || '' };
      const response = await apiCall(
        `${process.env.REACT_APP_BASE_API_URL}/api/wallets/search-users?` +
          new URLSearchParams({
            search: values.search,
            wallet: wallet.address,
          }),
        'GET',
        authHeader,
        null
      );

      const responseData = await response.json();
      if (
        response.ok &&
        responseData.data !== null &&
        responseData.data !== undefined
      ) {
        setSearchData(responseData.data);
      } else if (
        !response.ok &&
        responseData.message !== null &&
        responseData.message !== undefined
      ) {
        if (responseData.message.includes('Authorization failed')) {
          clearToken();
          navigate('/login');
        }
        setSearchError(responseData.message);
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

      const authHeader = { Authorization: userToken || '' };
      const response = await apiCall(
        `${process.env.REACT_APP_BASE_API_URL}/api/wallets/${wallet.address}/add-user`,
        'POST',
        authHeader,
        { accounts: accAddresses }
      );
      const responseData = await response.json();

      if (!response.ok) {
        if (
          responseData.message !== null &&
          responseData.message !== undefined
        ) {
          if (responseData.message.includes('Authorization failed')) {
            clearToken();
            navigate('/login');
          }
          setAddUserError(responseData.message);
          return;
        }

        throw new Error();
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
        <Grid item xs={12}>
          <h3>Wallet users</h3>
        </Grid>

        <form method='POST' onSubmit={removeUserForm.handleSubmit}>
          <Grid item xs={12} marginTop={3}>
            {content}
          </Grid>

          <Grid item xs={12} marginTop={1}>
            <Button variant='contained' onClick={addUserHandler}>
              Add Users
            </Button>
            <Button
              variant='contained'
              color='error'
              type='submit'
              sx={{ marginLeft: '16px' }}
            >
              Remove Users
            </Button>
          </Grid>
          {removeUserError && (
            <Grid item xs={12} marginTop={1}>
              <p className='error-message' style={{ textAlign: 'left' }}>
                {removeUserError}
              </p>
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
              <Grid item xs={10}>
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
              <Grid item xs={2}>
                <Button
                  type='submit'
                  sx={{ marginLeft: '20px', padding: '0', minWidth: 'auto' }}
                >
                  <SearchIcon />
                </Button>
                <Button
                  onClick={hideAddUserHandler}
                  sx={{ marginLeft: '20px', padding: '0', minWidth: 'auto' }}
                >
                  <CloseIcon />
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

        {searchData && (
          <Grid container marginTop={4}>
            <h3>Search results:</h3>
            {searchError !== null ? (
              <h4>{searchError}</h4>
            ) : (
              <form
                method='POST'
                onSubmit={searchResultsForm.handleSubmit}
                style={{ display: 'block', width: '100%' }}
              >
                <UsersTable users={searchData} form={searchResultsForm} />

                <Grid item xs={12} marginTop={2}>
                  <Button variant='contained' type='submit'>
                    Add
                  </Button>
                </Grid>
              </form>
            )}

            {addUserError && (
              <Grid item xs={12} marginTop={1}>
                <p className='error-message' style={{ textAlign: 'left' }}>
                  {addUserError}
                </p>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default WalletUsers;

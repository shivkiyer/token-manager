import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import UsersTable from './users-table';
import { authToken } from '../../../../utils/auth/auth';
import apiCall from '../../../../utils/http/api-call';

function WalletUsers({ wallet }: { wallet: any }) {
  const [userData, setUserData] = useState<any>(null);
  const [searchData, setSearchData] = useState<any>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [displayForm, setDisplayForm] = useState(false);
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
        setInitError(responseData.message);
      }
    } catch (e) {
      console.log(e);
    }
  }, [userToken, wallet]);

  useEffect(() => {
    fetchWalletUsers();
  }, [fetchWalletUsers]);

  const addUserHandler = () => {
    setDisplayForm(true);
  };

  const hideAddUserHandler = () => {
    searchForm.values.search = '';
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

  let content: any;

  if (initError !== null) {
    content = <p>{initError}</p>;
  } else if (userData !== null) {
    if (userData.length === 0) {
      content = <p>This wallet has no users.</p>;
    } else {
      content = <UsersTable users={userData} />;
    }
  }

  return (
    <>
      <Grid container marginTop={4} marginBottom={4}>
        <Grid item xs={12}>
          <h3>Wallet users</h3>
        </Grid>

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
            disabled={true}
            sx={{ marginLeft: '16px' }}
          >
            Remove Users
          </Button>
        </Grid>

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
              <UsersTable users={searchData} />
            )}
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default WalletUsers;

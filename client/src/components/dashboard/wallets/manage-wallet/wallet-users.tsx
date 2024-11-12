import { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { authToken } from '../../../../utils/auth/auth';
import apiCall from '../../../../utils/http/api-call';
import formatEthAddress from '../../../../utils/web3/formatEthAddress';

function WalletUsers({ wallet }: { wallet: any }) {
  const [userData, setUserData] = useState<any>(null);
  const [initError, setInitError] = useState<string | null>(null);
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

  let content: any;

  if (initError !== null) {
    content = <p>{initError}</p>;
  } else if (userData !== null) {
    if (userData.length === 0) {
      content = <p>This wallet has no users.</p>;
    } else {
      content = (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>A/c Name</TableCell>
                <TableCell>A/c address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((row: any) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{row.User.username}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{formatEthAddress(row.address, true)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  return (
    <>
      <Grid container marginTop={4}>
        <Grid item xs={12}>
          <h3>Wallet users</h3>
        </Grid>

        <Grid item xs={12} marginTop={3}>
          {content}
        </Grid>

        <Grid item xs={12} marginTop={1}>
          <Button variant='contained' type='submit'>
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
      </Grid>
    </>
  );
}

export default WalletUsers;

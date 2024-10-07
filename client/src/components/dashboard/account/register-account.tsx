import { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import apiCall from '../../../utils/http/api-call';
import useEthereum from '../../../hooks/useEthereum';
import useTokenAuthentication from '../../../hooks/useTokenAuthentication';

function RegisterAccount() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const web3 = useEthereum();
  const userToken: string | null = useTokenAuthentication();

  const nameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value.trim());
  };

  const addressHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value.trim());
  };

  const submitHandler = async () => {
    setLoading(true);
    const accounts = await web3.eth.getAccounts();
    if (!accounts.includes(address)) {
      setError('Account is not linked in Metamask.');
    } else {
      setError(null);
      setSuccess(null);
      try {
        const authHeader = { Authorization: userToken || '' };
        const response = await apiCall(
          `${process.env.REACT_APP_BASE_API_URL}/api/eth-accounts/add`,
          'POST',
          authHeader,
          { accountName: name, accountAddress: address }
        );
        const responseData = await response.json();
        if (!response.ok) {
          if (
            responseData.message !== null ||
            responseData.message !== undefined
          ) {
            setError(responseData.message);
          } else {
            throw '';
          }
        } else {
          setSuccess(
            'Account successfully added! Go to the LIST tab to view accounts.'
          );
          setName('');
          setAddress('');
        }
      } catch (e) {
        setError(
          'Account could not be added. Please try again later or contact the admin.'
        );
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Grid container alignContent='center' justifyContent='center'>
        <Grid item xs={10} md={6}>
          <TextField
            name='name'
            variant='standard'
            placeholder='Name'
            value={name}
            required
            fullWidth
            onChange={nameHandler}
          ></TextField>
        </Grid>
      </Grid>
      <Grid
        container
        alignContent='center'
        justifyContent='center'
        marginTop={5}
      >
        <Grid item xs={10} md={6}>
          <TextField
            name='address'
            variant='standard'
            placeholder='Address'
            value={address}
            required
            fullWidth
            onChange={addressHandler}
          ></TextField>
        </Grid>
      </Grid>

      {error && (
        <Grid
          container
          alignContent='center'
          justifyContent='center'
          marginTop={5}
        >
          <Grid item xs={10} md={6} sx={{ textAlign: 'center' }}>
            <p className='error-message'>{error}</p>
          </Grid>
        </Grid>
      )}

      <Grid
        container
        alignContent='center'
        justifyContent='center'
        marginTop={5}
      >
        <Grid item xs={10} md={6} sx={{ textAlign: 'center' }}>
          {loading ? (
            <CircularProgress size={26} />
          ) : (
            <Button variant='contained' onClick={submitHandler}>
              Add
            </Button>
          )}
        </Grid>
      </Grid>

      <Grid
        container
        alignContent='center'
        justifyContent='center'
        marginTop={5}
      >
        <Grid item xs={10} md={6} sx={{ textAlign: 'center' }}>
          {success && <h4>{success}</h4>}
        </Grid>
      </Grid>
    </>
  );
}

export default RegisterAccount;

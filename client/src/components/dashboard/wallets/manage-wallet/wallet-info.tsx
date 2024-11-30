import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';

import formatEthAddress from '../../../../utils/web3/formatEthAddress';
import isErrorInForm from '../../../../utils/forms/isErrorInForm';

function WalletInfo({ web3, wallet }: { web3: any; wallet: any }) {
  const [displayForm, setDisplayForm] = useState(false);

  const displayFormHandler = () => {
    setDisplayForm(true);
  };

  const hideFormHandler = () => {
    setDisplayForm(false);
  };

  const validateHandler = () => {
    return Yup.object({
      name: Yup.string()
        .min(2, 'Must be at least two characters')
        .required('Required'),
      description: Yup.string().max(6000, 'Must be less than 6000 characters'),
      maxLimit: Yup.number()
        .required('Required')
        .positive('Max withdrawal limit must be positive')
        .typeError('Max withdrawal limit must be a number'),
    });
  };

  const walletForm = useFormik({
    initialValues: {
      name: wallet.name,
      description: wallet.description,
      maxLimit: wallet.maxLimit,
    },
    validationSchema: validateHandler,
    onSubmit: (values) => console.log(values),
  });

  const getDisabledStatus = () => {
    return isErrorInForm(walletForm);
  };

  return (
    <>
      {displayForm ? (
        <form onSubmit={walletForm.handleSubmit}>
          <Grid item xs={12} md={10}>
            <TextField
              name='name'
              label='Wallet name'
              variant='standard'
              value={walletForm.values.name}
              onChange={walletForm.handleChange}
              onBlur={walletForm.handleBlur}
              fullWidth
            ></TextField>
            {walletForm.touched.name && walletForm.errors.name && (
              <p className='error-message'>
                {walletForm.errors.name.toString()}
              </p>
            )}
          </Grid>

          <Grid item xs={12} md={10} marginTop={3}>
            <TextField
              name='description'
              label='Description'
              variant='standard'
              value={walletForm.values.description}
              onChange={walletForm.handleChange}
              onBlur={walletForm.handleBlur}
              fullWidth
              multiline
              maxRows={4}
            ></TextField>
            {walletForm.touched.description &&
              walletForm.errors.description && (
                <p className='error-message'>
                  {walletForm.errors.description.toString()}
                </p>
              )}
          </Grid>

          <Grid item xs={12} md={10} marginTop={3}>
            <TextField
              name='maxLimit'
              label='Max withdrawal limit in Ether'
              variant='standard'
              value={walletForm.values.maxLimit}
              onChange={walletForm.handleChange}
              onBlur={walletForm.handleBlur}
              fullWidth
            ></TextField>
            {walletForm.touched.maxLimit && walletForm.errors.maxLimit && (
              <p className='error-message'>
                {walletForm.errors.maxLimit.toString()}
              </p>
            )}
          </Grid>

          <Grid item xs={12} md={8} marginTop={3} marginBottom={4}>
            <Button
              variant='contained'
              type='submit'
              disabled={getDisabledStatus()}
            >
              Update
            </Button>

            <Button
              variant='contained'
              color='error'
              onClick={hideFormHandler}
              sx={{ marginLeft: '12px' }}
            >
              Cancel
            </Button>
          </Grid>
        </form>
      ) : (
        <>
          <Grid item xs={12}>
            <h2 style={{ display: 'inline-block' }}>{wallet.name}</h2>
            <Button
              sx={{ padding: '0px', verticalAlign: 'top', marginTop: '4px' }}
              onClick={displayFormHandler}
            >
              <EditIcon />
            </Button>
          </Grid>

          <Grid item xs={12} marginTop={2}>
            <p>
              <strong>Account owner: </strong>
              {formatEthAddress(wallet.owner.address)}
            </p>
          </Grid>

          <Grid item xs={12} marginTop={2}>
            <p>
              <strong>Max withdrawal limit: </strong>
              {wallet.maxLimit} Ether
            </p>
          </Grid>

          <Grid item xs={12} marginTop={2}>
            <p>
              <strong>Description: </strong>
              {wallet.description !== null
                ? wallet.description
                : 'Not provided'}
            </p>
          </Grid>
        </>
      )}
    </>
  );
}

export default WalletInfo;

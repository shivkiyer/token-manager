import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import isErrorInForm from '../../../../utils/forms/isErrorInForm';

function WithdrawEther({ web3, wallet }: { web3: any; wallet: any }) {
  const validateForm = () => {
    return Yup.object({
      amount: Yup.number()
        .required('Required')
        .positive('Withdrawal amount must be positive')
        .max(wallet.maxLimit)
        .typeError('Withdrawal amount must be a number'),
    });
  };

  const withdrawalForm = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema: validateForm,
    onSubmit: (values: any) => console.log(values),
  });

  const submitDisabled = () => {
    return isErrorInForm(withdrawalForm);
  };

  return (
    <form method='POST' onSubmit={withdrawalForm.handleSubmit}>
      <Grid container>
        <Grid item xs={12} marginTop={3}>
          <TextField
            name='amount'
            label='Amount in Ether'
            variant='standard'
            value={withdrawalForm.values.amount}
            onChange={withdrawalForm.handleChange}
            onBlur={withdrawalForm.handleBlur}
            fullWidth
          ></TextField>
        </Grid>
        <Grid item xs={12} marginTop={1}>
          <Button
            variant='contained'
            type='submit'
            disabled={submitDisabled()}
            sx={{ marginRight: '12px' }}
          >
            Submit
          </Button>
          {withdrawalForm.touched.amount && withdrawalForm.errors.amount && (
            <span className='error-message'>
              {withdrawalForm.errors.amount.toString()}
            </span>
          )}
        </Grid>
      </Grid>
    </form>
  );
}

export default WithdrawEther;

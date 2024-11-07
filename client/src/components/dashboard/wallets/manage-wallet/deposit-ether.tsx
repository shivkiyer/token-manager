import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function DepositEther({
  hideDisplayDepositEther,
}: {
  hideDisplayDepositEther: () => void;
}) {
  const validateHandler = () => {
    return Yup.object({
      etherValue: Yup.number()
        .required('Required')
        .positive('Ether value must be positive')
        .typeError('Ether value must be a number'),
    });
  };

  const etherDepositForm = useFormik({
    initialValues: {
      etherValue: '',
    },
    validationSchema: validateHandler,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Grid item xs={12} marginTop={3}>
      <form onSubmit={etherDepositForm.handleSubmit}>
        <TextField
          name='etherValue'
          variant='standard'
          placeholder='Amount in Ether'
          value={etherDepositForm.values.etherValue}
          onChange={etherDepositForm.handleChange}
          onBlur={etherDepositForm.handleBlur}
        ></TextField>
        <Button variant='contained' sx={{ marginLeft: '16px' }} type='submit'>
          Deposit
        </Button>
        <Button
          variant='contained'
          color='error'
          sx={{ marginLeft: '16px' }}
          onClick={hideDisplayDepositEther}
        >
          Cancel
        </Button>
        {etherDepositForm.touched.etherValue &&
          etherDepositForm.errors.etherValue && (
            <p className='error-message' style={{ textAlign: 'left' }}>
              {etherDepositForm.errors.etherValue}
            </p>
          )}
      </form>
    </Grid>
  );
}

export default DepositEther;

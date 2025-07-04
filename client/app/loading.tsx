import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function DefaultLoading() {
  return (
    <Stack alignItems='center'>
      <CircularProgress size={80} />
    </Stack>
  );
}

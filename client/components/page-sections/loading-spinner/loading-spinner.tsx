import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingSpinner({
  size,
  radius,
  top,
}: {
  size: number;
  radius: number;
  top?: number | null;
}) {
  return (
    <Grid container sx={{ marginTop: `${top}px` }}>
      <Grid size={size}>
        <Stack alignItems='center'>
          <CircularProgress size={radius} />
        </Stack>
      </Grid>
    </Grid>
  );
}

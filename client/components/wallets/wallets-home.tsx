import Link from 'next/link';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function WalletsHome() {
  return (
    <Link
      href='/dashboard/wallet/list'
      className='button-link button-link-black'
      style={{ fontSize: '18px' }}
    >
      <ArrowBackIcon sx={{ paddingTop: '8px' }} />
      <Typography variant='button' sx={{ fontSize: '110%' }}>
        Back to wallets
      </Typography>
    </Link>
  );
}

import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function WalletsHome() {
  return (
    <Link
      href='/dashboard/wallet/list'
      className='button-link button-link-black'
      style={{ fontSize: '18px' }}
    >
      <ArrowBackIcon sx={{ paddingTop: '8px' }} />
      Back to wallets
    </Link>
  );
}

import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function WalletsHome() {
  return (
    <Link
      to='/dashboard/wallet/list'
      className='button-link button-link-black'
      style={{ fontSize: '18px' }}
    >
      <ArrowBackIcon sx={{ paddingTop: '8px' }} />
      Back to wallets
    </Link>
  );
}

export default WalletsHome;

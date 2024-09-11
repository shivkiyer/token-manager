import useTokenAuthentication from '../../../hooks/useTokenAuthentication';

function Account() {
  const userToken = useTokenAuthentication();
  return <h4>Account comes here</h4>;
}

export default Account;

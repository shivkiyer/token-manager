import useTokenAuthentication from '../../../hooks/useTokenAuthentication';

function Wallets() {
  const userToken = useTokenAuthentication();

  return <h4>Wallets come here</h4>;
}

export default Wallets;

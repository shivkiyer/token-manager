import useTokenAuthentication from '../../../hooks/useTokenAuthentication';

function Tokens() {
  const userToken = useTokenAuthentication();
  return <h4>Tokens come here</h4>;
}

export default Tokens;

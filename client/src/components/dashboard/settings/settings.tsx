import useTokenAuthentication from '../../../hooks/useTokenAuthentication';

function Settings() {
  const userToken = useTokenAuthentication();
  return <h4>Settings come here</h4>;
}

export default Settings;

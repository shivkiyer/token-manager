import { useEffect, useState } from 'react';

import useTokenAuthentication from '../../../hooks/useTokenAuthentication';
import useEthereum from '../../../hooks/useEthereum';

function Wallets() {
  const userToken = useTokenAuthentication();
  const web3 = useEthereum();
  const [web3Error, setWeb3Error] = useState<string | null>(null);

  useEffect(() => {
    if (web3 === null) {
      setWeb3Error('Please ensure Metamask wallet is unlocked and connected.');
    } else {
      setWeb3Error(null);
    }
  }, [web3]);

  return web3Error ? <h4>{web3Error}</h4> : <h4>Wallets come here</h4>;
}

export default Wallets;

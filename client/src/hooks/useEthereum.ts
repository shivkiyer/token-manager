import { useState, useEffect } from 'react';

import getWeb3 from '../utils/web3/web3';

/**
 * Custom hook for returning Metamask Ethereum account
 *
 * @returns {Object} Web3 instance
 */
function useEthereum() {
  const [web3, setWeb3] = useState<any>(null);

  useEffect(() => {
    const connectEthereum = async () => {
      try {
        if (web3 === null) {
          const web3Obj = await getWeb3();
          setWeb3(web3Obj);
        }
      } catch (e: any) {
        setWeb3(null);
      }
    };
    connectEthereum();
  }, [web3]);

  return web3;
}

export default useEthereum;

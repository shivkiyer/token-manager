import { createContext } from 'react';
import { useState, useEffect } from 'react';

import getWeb3 from '../../utils/web3/web3';

export const Web3Context = createContext<any>({
  web3: null,
});

const Web3ContextProvider = (props: any) => {
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

  return (
    <Web3Context.Provider value={{ web3: web3 }}>
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3ContextProvider;

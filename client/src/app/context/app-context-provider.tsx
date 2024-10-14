import { createContext } from 'react';
import { useState, useEffect } from 'react';

import getWeb3 from '../../utils/web3/web3';

export const AppContext = createContext<any>({
  web3: null,
});

const AppContextProvider = (props: any) => {
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
    <AppContext.Provider value={{ web3: web3 }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

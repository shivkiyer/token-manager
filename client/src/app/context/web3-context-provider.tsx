import { createContext } from 'react';
import { useState, useEffect } from 'react';

import getWeb3 from '../../utils/web3/web3';
import getContractFactoryData from '../../utils/web3/getContractFactoryData';

export const Web3Context = createContext<any>({
  web3: null,
  contractFactoryAddress: null,
  contractFactoryAbi: null,
});

const Web3ContextProvider = (props: any) => {
  const [web3, setWeb3] = useState<any>(null);
  const [contractFactoryAddress, setContractFactoryAddress] = useState<
    string | null
  >(null);
  const [contractFactoryAbi, setContractFactoryAbi] = useState<any>(null);

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

    const getContractFactoryAddress = async () => {
      if (contractFactoryAddress === null) {
        const address = await getContractFactoryData('get-address');
        setContractFactoryAddress(address);
      }
    };

    const getContractFactoryAbi = async () => {
      if (contractFactoryAbi === null) {
        const abi = await getContractFactoryData('get-abi');
        setContractFactoryAbi(abi);
      }
    };

    connectEthereum();
    getContractFactoryAddress();
    getContractFactoryAbi();
  }, [web3, contractFactoryAddress, contractFactoryAbi]);

  return (
    <Web3Context.Provider
      value={{ web3, contractFactoryAddress, contractFactoryAbi }}
    >
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3ContextProvider;

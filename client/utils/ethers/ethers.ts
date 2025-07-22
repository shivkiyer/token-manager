import { ethers } from 'ethers';

export default async function getEthers() {
  await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
  const ethProvider = new ethers.BrowserProvider((window as any).ethereum);
  return ethProvider;
}

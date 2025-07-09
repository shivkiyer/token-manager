import { AccountUser } from './account';

export interface Wallet {
  id: number;
  name: string;
  description: string;
  address: string;
  maxLimit: number;
  owner: {
    id: number;
    name: string;
    address: string;
    userId: number;
  };
  user?: AccountUser[];
  isOwner: boolean;
  abi?: any;
}

export interface WalletForm {
  name: string;
  description: string;
  maxLimit: string;
}

export default interface Account {
  accountId: number;
  accountName: string;
  accountAddress: string;
}

export interface AccountUser {
  id: number;
  name: string;
  address: string;
  User?: {
    id: number;
    username: string;
  };
}

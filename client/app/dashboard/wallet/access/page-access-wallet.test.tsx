import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('AccessWallet', () => {
  let mockGetWalletDetails: any, mockGetSharedWalletData: any;
  let mockGetWeb3: any;
  let mockEstimateGas: any, mockSendWithdraw: any, mockFormatEthAddress: any;

  beforeEach(() => {
    jest.mock('next/navigation', () => {
      return {
        useParams: jest.fn().mockReturnValue('1'),
      };
    });

    const formatEthAddressUtil = require('@/utils/web3/formatEthAddress');
    mockFormatEthAddress = jest.spyOn(formatEthAddressUtil, 'default');
    mockFormatEthAddress.mockImplementation((address: string) => address);

    mockEstimateGas = jest.fn().mockReturnValue(Promise.resolve(BigInt(1)));

    mockSendWithdraw = jest.fn().mockReturnValue(
      Promise.resolve({
        transactionHash: 'txn123',
      })
    );

    const web3Util = require('@/utils/web3/web3');
    mockGetWeb3 = jest.spyOn(web3Util, 'default');
    mockGetWeb3.mockReturnValue(
      Promise.resolve({
        eth: {
          getAccounts: jest
            .fn()
            .mockReturnValue(Promise.resolve(['AccountAddress456'])),
          Contract: jest.fn().mockReturnValue({
            methods: {
              withdraw: jest.fn().mockReturnValue({
                estimateGas: mockEstimateGas,
                send: mockSendWithdraw,
              }),
            },
          }),
        },
        utils: {
          fromWei: jest
            .fn()
            .mockImplementation((val: BigInt) => Promise.resolve(val)),
          toWei: jest
            .fn()
            .mockImplementation((val: BigInt) => Promise.resolve(val)),
        },
      })
    );

    const walletDetailsUtil = require('@/actions/wallet/getWalletDetails');
    mockGetWalletDetails = jest.spyOn(walletDetailsUtil, 'default');
    mockGetWalletDetails.mockReturnValue(
      Promise.resolve({
        data: {
          id: 1,
          name: 'Wallet 1',
          description: 'Wallet 1 description',
          address: 'wallet1address123',
          maxLimit: 2.5,
          isOwner: true,
          owner: { address: 'AccountAddress123' },
          user: [
            {
              id: 1,
              name: 'Account 1',
              address: 'AccountAddress456',
              User: {
                username: 'abc@gmail.com',
              },
            },
            {
              id: 2,
              name: 'Account 2',
              address: 'AccountAddress789',
              User: {
                username: 'def@gmail.com',
              },
            },
          ],
        },
      })
    );

    const sharedWalletDataUtil = require('@/actions/contract-factory/getSharedWalletAbi');
    mockGetSharedWalletData = jest.spyOn(sharedWalletDataUtil, 'default');
    mockGetSharedWalletData.mockReturnValue(
      Promise.resolve({
        data: {
          abi: 'sample-abi',
        },
      })
    );
  });

  it('should display wallet information and wallet users', async () => {
    const AccessWallet = require('./[walletId]/page').default;

    render(<AccessWallet />);
    await waitFor(() => {
      expect(screen.getByText('Wallet 1')).toBeInTheDocument();
      expect(screen.getByText('Wallet 1 description')).toBeInTheDocument();
      expect(
        screen.getByText('2.5 Ether', { exact: false })
      ).toBeInTheDocument();
      expect(screen.getByText('abc@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('Account 1')).toBeInTheDocument();
      expect(screen.getByText('AccountAddress456')).toBeInTheDocument();
      expect(screen.getByText('def@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('Account 2')).toBeInTheDocument();
      expect(screen.getByText('AccountAddress789')).toBeInTheDocument();
    });
  });

  it('should display a form for withdrawing ether if linked Metamask account is a wallet user', async () => {
    const AccessWallet = require('./[walletId]/page').default;

    render(<AccessWallet />);
    await waitFor(() => {
      expect(screen.getByLabelText('Amount in Ether')).toBeInTheDocument();
    });
  });

  it('should display an error if the linked Metamask account is not a wallet user', async () => {
    mockGetWeb3.mockReturnValue(
      Promise.resolve({
        eth: {
          getAccounts: jest
            .fn()
            .mockReturnValue(Promise.resolve(['AccountAddress159'])),
          Contract: jest.fn().mockReturnValue({
            methods: {
              withdraw: jest.fn().mockReturnValue({
                estimateGas: mockEstimateGas,
                send: mockSendWithdraw,
              }),
            },
          }),
        },
        utils: {
          fromWei: jest
            .fn()
            .mockImplementation((val: BigInt) => Promise.resolve(val)),
          toWei: jest
            .fn()
            .mockImplementation((val: BigInt) => Promise.resolve(val)),
        },
      })
    );

    const AccessWallet = require('./[walletId]/page').default;

    render(<AccessWallet />);
    await waitFor(() => {
      expect(
        screen.getByText('Linked Metamask account is not a wallet user')
      ).toBeInTheDocument();
    });
  });

  it('should enable a wallet user to submit a valid ether withdrawal request', async () => {
    const AccessWallet = require('./[walletId]/page').default;

    render(<AccessWallet />);

    let withdrawField: any, submitBtn: any;
    await waitFor(() => {
      withdrawField = screen.getByLabelText('Amount in Ether');
      expect(withdrawField).toBeInTheDocument();
      submitBtn = screen.getByRole('button', { name: 'Submit' });
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();
    });

    await userEvent.type(withdrawField, '0.5');
    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });

    await userEvent.type(withdrawField, 'xxx');
    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });

    await userEvent.clear(withdrawField);
    await userEvent.type(withdrawField, '0.5');
    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });

    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(mockEstimateGas).toHaveBeenCalled();
      expect(mockSendWithdraw).toHaveBeenCalled();
    });
  });
});

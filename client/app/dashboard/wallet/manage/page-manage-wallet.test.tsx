import {
  render,
  screen,
  waitFor,
  fireEvent,
  findByRole,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ManageWallet', () => {
  let mockWalletDetails: any,
    mockGetSharedWalletData: any,
    mockGetWalletUsers: any,
    mockUpdateWalletDetails: any,
    mockAddUserToWallet: any,
    mockSearchWalletUsers: any,
    mockRemoveWalletUsers: any;
  let mockGetWeb3: any,
    mockEstimateGas: any,
    mockSendUpdateWithdrawalLimit: any,
    mockSendTransaction: any,
    mockGetBalance: any,
    mockSendSetWithdrawers: any,
    mockSendRemoveWithdrawers: any;
  let mockFormatEthAddress: any;

  beforeEach(() => {
    jest.mock('next/navigation', () => {
      return {
        useParams: jest.fn().mockReturnValue(Promise.resolve('1')),
      };
    });

    const formatEthAddressUtil = require('@/utils/web3/formatEthAddress');
    mockFormatEthAddress = jest.spyOn(formatEthAddressUtil, 'default');
    mockFormatEthAddress.mockImplementation((address: string) => address);

    mockGetBalance = jest.fn().mockReturnValue(Promise.resolve(BigInt(1)));

    mockEstimateGas = jest.fn().mockReturnValue(Promise.resolve(BigInt(1)));

    mockSendUpdateWithdrawalLimit = jest.fn().mockReturnValue(
      Promise.resolve({
        transactionHash: 'txn123',
      })
    );

    mockSendSetWithdrawers = jest.fn().mockReturnValue(
      Promise.resolve({
        transactionHash: 'txn456',
      })
    );

    mockSendRemoveWithdrawers = jest.fn().mockReturnValue(
      Promise.resolve({
        transactionHash: 'txn456',
      })
    );

    mockSendTransaction = jest.fn().mockReturnValue(Promise.resolve(null));

    const web3Util = require('@/utils/web3/web3');
    mockGetWeb3 = jest.spyOn(web3Util, 'default');
    mockGetWeb3.mockReturnValue(
      Promise.resolve({
        eth: {
          getAccounts: jest
            .fn()
            .mockReturnValue(Promise.resolve(['AccountAddress123'])),
          getBalance: mockGetBalance,
          Contract: jest.fn().mockReturnValue({
            methods: {
              updateWithdrawalLimit: jest.fn().mockReturnValue({
                estimateGas: mockEstimateGas,
                send: mockSendUpdateWithdrawalLimit,
              }),
              setWithdrawers: jest.fn().mockReturnValue({
                estimateGas: mockEstimateGas,
                send: mockSendSetWithdrawers,
              }),
              removeWithdrawers: jest.fn().mockReturnValue({
                estimateGas: mockEstimateGas,
                send: mockSendRemoveWithdrawers,
              }),
            },
          }),
          sendTransaction: mockSendTransaction,
          estimateGas: mockEstimateGas,
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

    const sharedWalletDataUtil = require('@/actions/contract-factory/getSharedWalletAbi');
    mockGetSharedWalletData = jest.spyOn(sharedWalletDataUtil, 'default');
    mockGetSharedWalletData.mockReturnValue(
      Promise.resolve({
        data: {
          abi: 'sample-abi',
        },
      })
    );

    const walletDetailsUtil = require('@/actions/wallet/getWalletDetails');
    mockWalletDetails = jest.spyOn(walletDetailsUtil, 'default');
    mockWalletDetails.mockReturnValue(
      Promise.resolve({
        data: {
          id: 1,
          name: 'Wallet 1',
          description: 'Wallet 1 description',
          address: 'wallet1address123',
          maxLimit: 2.5,
          isOwner: true,
          owner: { address: 'AccountAddress123' },
        },
      })
    );

    const getWalletUsersUtil = require('@/actions/wallet/getWalletUsers');
    mockGetWalletUsers = jest.spyOn(getWalletUsersUtil, 'default');
    mockGetWalletUsers.mockReturnValue(
      Promise.resolve({
        data: [
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
          {
            id: 3,
            name: 'Account 3',
            address: 'AccountAddress147',
            User: {
              username: 'ghi@gmail.com',
            },
          },
        ],
      })
    );

    const updateWalletDetailsUtil = require('@/actions/wallet/updateWalletDetails');
    mockUpdateWalletDetails = jest.spyOn(updateWalletDetailsUtil, 'default');
    mockUpdateWalletDetails.mockReturnValue(
      Promise.resolve({
        data: {
          name: 'Wallet 1 changed',
          description: 'Wallet 1 description changed',
          maxLimit: 3.5,
        },
      })
    );

    const addUserToWalletUtil = require('@/actions/wallet/addUsersToWallet');
    mockAddUserToWallet = jest.spyOn(addUserToWalletUtil, 'default');
    mockAddUserToWallet.mockReturnValue(
      Promise.resolve({
        data: {},
      })
    );

    const searchWalletUsersUtil = require('@/actions/wallet/searchWalletUsers');
    mockSearchWalletUsers = jest.spyOn(searchWalletUsersUtil, 'default');
    mockSearchWalletUsers.mockReturnValue(
      Promise.resolve({
        data: [
          {
            id: 4,
            User: { username: 'lmn@gmail.com' },
            name: 'Account 1',
            address: 'AccountAddress1234',
          },
          {
            id: 5,
            User: { username: 'opq@gmail.com' },
            name: 'Account 2',
            address: 'AccountAddress4567',
          },
        ],
      })
    );

    const removeWalletUsersUtil = require('@/actions/wallet/removeWalletUsers');
    mockRemoveWalletUsers = jest.spyOn(removeWalletUsersUtil, 'default');
    mockRemoveWalletUsers.mockReturnValue(Promise.resolve({ data: null }));
  });

  it('should display wallet details and users along with action buttons', async () => {
    const ManageWallet = require('./[walletId]/page').default;

    render(<ManageWallet />);
    await waitFor(() => {
      expect(screen.getByText('Wallet 1')).toBeInTheDocument();
      expect(screen.getByText('Wallet 1 description')).toBeInTheDocument();
      expect(screen.getByText('AccountAddress123')).toBeInTheDocument();
      expect(
        screen.getByText('2.5 Ether', { exact: false })
      ).toBeInTheDocument();
      expect(screen.getByText('1 Ether', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('abc@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('def@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('ghi@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('Account 1')).toBeInTheDocument();
      expect(screen.getByText('Account 2')).toBeInTheDocument();
      expect(screen.getByText('Account 3')).toBeInTheDocument();
      expect(screen.getByText('AccountAddress456')).toBeInTheDocument();
      expect(screen.getByText('AccountAddress789')).toBeInTheDocument();
      expect(screen.getByText('AccountAddress147')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Deposit Ether' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Add Users' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Remove Users' })
      ).toBeInTheDocument();
    });
  });

  it('should show form for editing wallet details when edit button is clicked', async () => {
    const ManageWallet = require('./[walletId]/page').default;

    render(<ManageWallet />);
    let editWalletBtn: any;
    await waitFor(() => {
      editWalletBtn = screen.getByTestId('edit-wallet-details-btn');
      expect(editWalletBtn).toBeInTheDocument();
    });
    await userEvent.click(editWalletBtn);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Wallet 1')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('Wallet 1 description')
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('2.5')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Update' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
    });
  });

  it('should update the wallet info if edit wallet details form is successfully submitted', async () => {
    const ManageWallet = require('./[walletId]/page').default;

    render(<ManageWallet />);
    let editWalletBtn: any;
    await waitFor(() => {
      editWalletBtn = screen.getByTestId('edit-wallet-details-btn');
      expect(editWalletBtn).toBeInTheDocument();
    });
    await userEvent.click(editWalletBtn);

    let updateBtn: any;

    await waitFor(async () => {
      updateBtn = screen.getByRole('button', { name: 'Update' });
      expect(updateBtn).toBeInTheDocument();
      expect(updateBtn).toBeDisabled();
    });

    await waitFor(async () => {
      const nameField = screen.getByDisplayValue('Wallet 1');
      await userEvent.type(nameField, ' changed');

      updateBtn = screen.getByRole('button', { name: 'Update' });
      expect(updateBtn).not.toBeDisabled();

      await userEvent.click(updateBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Wallet 1 changed')).toBeInTheDocument();
      expect(
        screen.getByText('Wallet 1 description changed')
      ).toBeInTheDocument();
      expect(
        screen.getByText('3.5 Ether', { exact: false })
      ).toBeInTheDocument();
    });
  });

  it('should allow the wallet owner to deposit ether', async () => {
    const ManageWallet = require('./[walletId]/page').default;

    render(<ManageWallet />);
    let depositEtherBtn: any;
    await waitFor(() => {
      expect(screen.getByText('AccountAddress456')).toBeInTheDocument();
      depositEtherBtn = screen.getByRole('button', { name: 'Deposit Ether' });
      expect(depositEtherBtn).toBeInTheDocument();
    });
    await userEvent.click(depositEtherBtn);

    let etherField: any;
    await waitFor(() => {
      etherField = screen.getByPlaceholderText('Amount in Ether');
    });
    await userEvent.type(etherField, 'abc');

    let depositBtn: any;
    await waitFor(async () => {
      depositBtn = screen.getByRole('button', { name: 'Deposit' });
      expect(depositBtn).toBeInTheDocument();
    });
    await userEvent.click(depositBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Ether value must be a number', { exact: false })
      ).toBeInTheDocument();
    });

    await userEvent.clear(etherField);
    await userEvent.type(etherField, '-0.1');

    await userEvent.click(depositBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Ether value must be positive', { exact: false })
      ).toBeInTheDocument();
    });

    await userEvent.clear(etherField);
    await userEvent.type(etherField, '10');

    await userEvent.click(depositBtn);

    await waitFor(() => {
      expect(mockSendTransaction).toHaveBeenCalled();
      expect(depositBtn).not.toBeInTheDocument();
    });
  });

  it('should display users to add to wallet when user search field is used', async () => {
    const ManageWallet = require('./[walletId]/page').default;

    render(<ManageWallet />);

    let addUserBtn: any;
    await waitFor(() => {
      addUserBtn = screen.getByRole('button', { name: 'Add Users' });
      expect(addUserBtn).toBeInTheDocument();
    });
    await userEvent.click(addUserBtn);

    let searchUserField: any, searchBtn: any, closeBtn: any;
    await waitFor(() => {
      searchUserField = screen.getByPlaceholderText('Username or Account', {
        exact: false,
      });
      expect(searchUserField).toBeInTheDocument();
      searchBtn = screen.getByTestId('SearchIcon');
      expect(searchBtn).toBeInTheDocument();
      closeBtn = screen.getByTestId('CloseIcon');
      expect(closeBtn).toBeInTheDocument();
    });

    await userEvent.type(searchUserField, 'somestr');
    await userEvent.click(searchBtn);
    await waitFor(() => {
      expect(
        screen.getByText('Search results', { exact: false })
      ).toBeInTheDocument();
      expect(screen.getByText('lmn@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('opq@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('AccountAddress1234')).toBeInTheDocument();
      expect(screen.getByText('AccountAddress4567')).toBeInTheDocument();
    });

    await waitFor(() => {
      userEvent.click(closeBtn);
      expect(searchUserField).not.toBeInTheDocument();
      expect(searchBtn).not.toBeInTheDocument();
      expect(closeBtn).not.toBeInTheDocument();
    });
  });

  it('should allow the wallet owner to select users from the search results and add them to the wallet', async () => {
    const ManageWallet = require('./[walletId]/page').default;

    render(<ManageWallet />);

    let addUserBtn: any;
    await waitFor(() => {
      addUserBtn = screen.getByRole('button', { name: 'Add Users' });
      expect(addUserBtn).toBeInTheDocument();
    });
    await userEvent.click(addUserBtn);

    let searchUserField: any, searchBtn: any;
    await waitFor(() => {
      searchUserField = screen.getByPlaceholderText('Username or Account', {
        exact: false,
      });
      expect(searchUserField).toBeInTheDocument();
      searchBtn = screen.getByTestId('SearchIcon');
    });

    await userEvent.type(searchUserField, 'somestr');
    await userEvent.click(searchBtn);
    await waitFor(() => {
      expect(
        screen.getByText('Search results', { exact: false })
      ).toBeInTheDocument();
      expect(screen.getByText('lmn@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('opq@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('AccountAddress1234')).toBeInTheDocument();
      expect(screen.getByText('AccountAddress4567')).toBeInTheDocument();
    });

    let addUserToWalletBtn: any, selectBoxes: any;
    await waitFor(() => {
      addUserToWalletBtn = screen.getByRole('button', { name: 'Add' });
      expect(addUserToWalletBtn).toBeInTheDocument();
      selectBoxes = screen.getAllByRole('checkbox');
      expect(selectBoxes.length).toBe(5);
    });

    await userEvent.click(addUserToWalletBtn);
    await waitFor(() => {
      expect(
        screen.getByText('No account selected', { exact: false })
      ).toBeInTheDocument();
    });

    await userEvent.click(selectBoxes[selectBoxes.length - 1]);
    await waitFor(async () => {
      expect(selectBoxes[selectBoxes.length - 1]).toBeChecked();
    });

    await userEvent.click(addUserToWalletBtn);
    await waitFor(() => {
      expect(addUserToWalletBtn).not.toBeInTheDocument();
      expect(mockAddUserToWallet).toHaveBeenCalled();
    });
  });

  it('should allow the wallet owner to remove users from the wallet', async () => {
    const ManageWallet = require('./[walletId]/page').default;

    render(<ManageWallet />);

    let selectBoxes: any, removeBtn: any;
    await waitFor(() => {
      expect(screen.getByText('abc@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('def@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('ghi@gmail.com')).toBeInTheDocument();
      selectBoxes = screen.getAllByRole('checkbox');
      expect(selectBoxes.length).toBe(3);
      removeBtn = screen.getByRole('button', { name: 'Remove Users' });
      expect(removeBtn).toBeInTheDocument();
    });

    await userEvent.click(selectBoxes[0]);
    await userEvent.click(removeBtn);
    await waitFor(() => {
      expect(mockRemoveWalletUsers).toHaveBeenCalled();
      expect(mockSendRemoveWithdrawers).toHaveBeenCalled();
    });
  });
});

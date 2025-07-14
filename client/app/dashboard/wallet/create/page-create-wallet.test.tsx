import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('CreateWallet', () => {
  let mockGetWeb3: any, mockVerifyWallet: any, mockGetContractFactoryData: any;
  let mockGetAccounts: any, mockEstimateGas: any, mockToWei: any, mockSend: any;
  let mockCreateWallet: any;

  beforeEach(() => {
    mockGetAccounts = jest
      .fn()
      .mockReturnValue(Promise.resolve(['AccountAddress123']));

    mockEstimateGas = jest.fn().mockReturnValue(Promise.resolve(BigInt(1)));

    mockSend = jest.fn().mockReturnValue(
      Promise.resolve({
        events: {
          SharedWalletCreated: {
            returnValues: {
              wallet: 'WalletAddress123',
            },
          },
        },
      })
    );

    mockToWei = jest.fn().mockReturnValue(BigInt(1));

    const web3Util = require('@/utils/web3/web3');
    mockGetWeb3 = jest.spyOn(web3Util, 'default');

    mockGetWeb3.mockReturnValue(
      Promise.resolve({
        eth: {
          getAccounts: mockGetAccounts,
          Contract: jest.fn().mockReturnValue({
            methods: {
              createSharedWallet: jest.fn().mockReturnValue({
                estimateGas: mockEstimateGas,
                send: mockSend,
              }),
            },
          }),
        },
        utils: {
          toWei: mockToWei,
        },
      })
    );

    const verifyWalletUtil = require('@/actions/wallet/verifyWallet');
    mockVerifyWallet = jest.spyOn(verifyWalletUtil, 'default');
    mockVerifyWallet.mockReturnValue(Promise.resolve(null));

    const contractFactoryDataUtil = require('@/actions/contract-factory/getContracyFactoryData');
    mockGetContractFactoryData = jest.spyOn(contractFactoryDataUtil, 'default');
    mockGetContractFactoryData.mockReturnValue(
      Promise.resolve({
        data: {
          abi: {},
          address: 'contract123',
        },
      })
    );

    const createWalletUtil = require('@/actions/wallet/createWallet');
    mockCreateWallet = jest.spyOn(createWalletUtil, 'default');
    mockCreateWallet.mockReturnValue(Promise.resolve({ data: 'Wallet123' }));
  });

  it('should display wallet creation form', async () => {
    const CreateWallet = require('./page').default;

    render(<CreateWallet />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Wallet name')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Wallet description')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Maximum withdrawal limit', {
          exact: false,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Wallet Owner', {
          exact: false,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: 'Fetch',
        })
      ).toBeInTheDocument();
      const createBtn = screen.getByRole('button', { name: 'Create Wallet' });
      expect(createBtn).toBeInTheDocument();
      expect(createBtn).toBeDisabled();
    });
  });

  it('should allow a user to connect to a Metamask wallet account', async () => {
    const CreateWallet = require('./page').default;

    render(<CreateWallet />);
    let fetchBtn: any;
    await waitFor(() => {
      fetchBtn = screen.getByRole('button', {
        name: 'Fetch',
      });
    });

    await userEvent.click(fetchBtn);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Change' })
      ).toBeInTheDocument();
    });
  });

  it('should display error if no linked Metamask account found', async () => {
    mockGetAccounts = jest.fn().mockReturnValue(Promise.resolve([]));

    mockGetWeb3.mockReturnValue(
      Promise.resolve({
        eth: {
          getAccounts: mockGetAccounts,
          Contract: jest.fn().mockReturnValue({
            methods: {
              createSharedWallet: {
                estimateGas: mockEstimateGas,
                send: mockSend,
              },
            },
          }),
        },
        utils: {
          toWei: mockToWei,
        },
      })
    );

    const CreateWallet = require('./page').default;

    render(<CreateWallet />);
    let fetchBtn: any;
    await waitFor(() => {
      fetchBtn = screen.getByRole('button', {
        name: 'Fetch',
      });
    });

    await userEvent.click(fetchBtn);
    await waitFor(() => {
      expect(
        screen.getByText('No Metamask account found', { exact: false })
      ).toBeInTheDocument();
    });
  });

  it('should display a field required error if wallet name is not provided', async () => {
    const CreateWallet = require('./page').default;

    render(<CreateWallet />);
    let nameField: any, maxLimitField: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Wallet name');
      maxLimitField = screen.getByPlaceholderText('Maximum withdrawal limit', {
        exact: false,
      });
    });

    await userEvent.click(nameField);
    await userEvent.click(maxLimitField);
    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Create Wallet' })
      ).toBeDisabled();
    });
  });

  it('should display a field required error if max withdrawal limit is not provided', async () => {
    const CreateWallet = require('./page').default;

    render(<CreateWallet />);
    let nameField: any, maxLimitField: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Wallet name');
      maxLimitField = screen.getByPlaceholderText('Maximum withdrawal limit', {
        exact: false,
      });
    });

    await userEvent.type(nameField, 'Wallet 1');
    await userEvent.click(maxLimitField);
    await userEvent.click(nameField);
    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Create Wallet' })
      ).toBeDisabled();
    });
  });

  it('should display a wrong input error is max withdrawal limit is not a number', async () => {
    const CreateWallet = require('./page').default;

    render(<CreateWallet />);
    let nameField: any, maxLimitField: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Wallet name');
      maxLimitField = screen.getByPlaceholderText('Maximum withdrawal limit', {
        exact: false,
      });
    });

    await userEvent.type(nameField, 'Wallet 1');
    await userEvent.type(maxLimitField, 'abc');
    await userEvent.click(nameField);
    await waitFor(() => {
      expect(
        screen.getByText('must be a number', { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Create Wallet' })
      ).toBeDisabled();
    });
  });

  it('should not enable the Create Wallet button until an owner account has been selected from Metamask', async () => {
    const CreateWallet = require('./page').default;

    render(<CreateWallet />);
    let nameField: any, maxLimitField: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Wallet name');
      maxLimitField = screen.getByPlaceholderText('Maximum withdrawal limit', {
        exact: false,
      });
    });

    await userEvent.type(nameField, 'Wallet 1');
    await userEvent.type(maxLimitField, '0.5');
    await userEvent.click(nameField);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Create Wallet' })
      ).toBeDisabled();
    });
  });

  it('should not enable the Create Wallet button until an owner account has been selected from Metamask', async () => {
    const CreateWallet = require('./page').default;

    render(<CreateWallet />);
    let nameField: any, maxLimitField: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Wallet name');
      maxLimitField = screen.getByPlaceholderText('Maximum withdrawal limit', {
        exact: false,
      });
    });

    await userEvent.type(nameField, 'Wallet 1');
    await userEvent.type(maxLimitField, '0.5');
    await userEvent.click(nameField);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Create Wallet' })
      ).toBeDisabled();
    });
  });

  it('should enable the Create Wallet button when form is filled correctly', async () => {
    const CreateWallet = require('./page').default;

    render(<CreateWallet />);
    let nameField: any, maxLimitField: any, fetchBtn: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Wallet name');
      maxLimitField = screen.getByPlaceholderText('Maximum withdrawal limit', {
        exact: false,
      });
      fetchBtn = screen.getByRole('button', {
        name: 'Fetch',
      });
    });

    await userEvent.type(nameField, 'Wallet 1');
    await userEvent.type(maxLimitField, '0.5');
    await userEvent.click(nameField);
    await userEvent.click(fetchBtn);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Create Wallet' })
      ).not.toBeDisabled();
    });
  });

  it('should display a success message if backend does not return error message', async () => {
    const CreateWallet = require('./page').default;

    render(<CreateWallet />);
    let nameField: any, maxLimitField: any, fetchBtn: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Wallet name');
      maxLimitField = screen.getByPlaceholderText('Maximum withdrawal limit', {
        exact: false,
      });
      fetchBtn = screen.getByRole('button', {
        name: 'Fetch',
      });
    });

    await userEvent.type(nameField, 'Wallet 1');
    await userEvent.type(maxLimitField, '0.5');
    await userEvent.click(nameField);
    await userEvent.click(fetchBtn);
    await waitFor(async () => {
      const createBtn = screen.getByRole('button', { name: 'Create Wallet' });
      expect(createBtn).not.toBeDisabled();
      await userEvent.click(createBtn);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Wallet created successfully', { exact: false })
      ).toBeInTheDocument();
    });
  });

  it('should display a error message if backend returns error message', async () => {
    mockCreateWallet.mockReturnValue(
      Promise.resolve({ message: 'Some error' })
    );
    const CreateWallet = require('./page').default;

    render(<CreateWallet />);
    let nameField: any, maxLimitField: any, fetchBtn: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Wallet name');
      maxLimitField = screen.getByPlaceholderText('Maximum withdrawal limit', {
        exact: false,
      });
      fetchBtn = screen.getByRole('button', {
        name: 'Fetch',
      });
    });

    await userEvent.type(nameField, 'Wallet 1');
    await userEvent.type(maxLimitField, '0.5');
    await userEvent.click(nameField);
    await userEvent.click(fetchBtn);
    await waitFor(async () => {
      const createBtn = screen.getByRole('button', { name: 'Create Wallet' });
      expect(createBtn).not.toBeDisabled();
      await userEvent.click(createBtn);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Some error', { exact: false })
      ).toBeInTheDocument();
    });
  });
});

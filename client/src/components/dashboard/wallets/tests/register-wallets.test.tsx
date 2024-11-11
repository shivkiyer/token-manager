import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import waitDelay from '../../../../test-utils/wait-delay';

describe('RegisterWallet', () => {
  let mockFormatEthAddress: any;
  let mockAuthToken: any;
  let mockGetWeb3: any;
  let mockGetContractFactoryData: any;
  let MockRootComponent: any;
  let mockApiCall: any;

  beforeEach(() => {
    mockFormatEthAddress = jest.spyOn(
      require('./../../../../utils/web3/formatEthAddress'),
      'default'
    );
    mockFormatEthAddress.mockImplementation((address: string) => address);

    mockAuthToken = jest.spyOn(
      require('./../../../../utils/auth/auth'),
      'authToken'
    );
    mockAuthToken.mockReturnValue('token123');

    mockApiCall = jest.spyOn(
      require('./../../../../utils/http/api-call'),
      'default'
    );
    mockApiCall.mockReturnValue(
      Promise.resolve(new Response(null, { status: 201 }))
    );

    mockGetWeb3 = jest.spyOn(
      require('./../../../../utils/web3/web3'),
      'default'
    );

    class MockContract {
      constructor() {
        return {
          methods: {
            createSharedWallet: () => {
              return {
                estimateGas: () => {
                  return BigInt(10);
                },
                send: () =>
                  Promise.resolve({
                    events: {
                      SharedWalletCreated: {
                        returnValues: {
                          wallet: 'walletaddress',
                        },
                      },
                    },
                  }),
              };
            },
          },
        };
      }
    }

    mockGetWeb3.mockReturnValue({
      eth: {
        getAccounts: () => Promise.resolve(['Account123']),
        abi: {
          encodeFunctionSignature: () => Promise.resolve(''),
        },
        estimateGas: () => Promise.resolve(BigInt(1)),
        Contract: MockContract,
      },
      utils: {
        toWei: (value: string | number) => value,
      },
    });

    mockGetContractFactoryData = jest.spyOn(
      require('./../../../../utils/web3/getContractFactoryData'),
      'default'
    );
    mockGetContractFactoryData.mockImplementation((url: string) => {
      if (url === 'get-address') {
        return Promise.resolve('ContractAddress123');
      } else if (url === 'get-abi') {
        return Promise.resolve({});
      }
    });

    MockRootComponent = () => {
      return <Outlet></Outlet>;
    };
  });

  it('should display the wallet creation form', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const RegisterWallet = require('./../register-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          { path: '/dashboard/wallets/create', element: <RegisterWallet /> },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/create', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Wallet name')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Wallet description')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Maximum withdrawal limit (in ether)')
      ).toBeInTheDocument();
      expect(screen.getByText('Account123')).toBeInTheDocument();
      const createBtn = screen.getByRole('button', { name: 'Create Wallet' });
      expect(createBtn).toBeInTheDocument();
      expect(createBtn).toHaveAttribute('disabled');
    });
  });

  it('should enable the submit button if form fields are correctly entered', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const RegisterWallet = require('./../register-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          { path: '/dashboard/wallets/create', element: <RegisterWallet /> },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/create', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Account123')).toBeInTheDocument();
    });

    const nameField = await screen.getByPlaceholderText('Wallet name');
    userEvent.type(nameField, 'Wallet 1');
    const descriptionField = await screen.getByPlaceholderText(
      'Wallet description'
    );
    userEvent.type(descriptionField, 'Wallet 1 description');
    const maxLimitField = await screen.getByPlaceholderText(
      'Maximum withdrawal limit (in ether)'
    );
    userEvent.type(maxLimitField, '2');

    await waitFor(() => {
      const createBtn = screen.getByRole('button', { name: 'Create Wallet' });
      expect(createBtn).not.toHaveAttribute('disabled');
    });
  });

  it('should display errors above form fields if incorrect data is entered', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const RegisterWallet = require('./../register-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          { path: '/dashboard/wallets/create', element: <RegisterWallet /> },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/create', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Account123')).toBeInTheDocument();
    });

    const nameField = await screen.getByPlaceholderText('Wallet name');
    userEvent.type(nameField, '');
    const descriptionField = await screen.getByPlaceholderText(
      'Wallet description'
    );
    userEvent.click(descriptionField);

    let requiredErrorText: any;

    requiredErrorText = await screen.findByText('Required');
    await waitFor(async () => {
      expect(requiredErrorText).toBeInTheDocument();
    });

    userEvent.type(nameField, 'Wallet 1');
    userEvent.click(descriptionField);

    await waitDelay(100);

    await waitFor(async () => {
      expect(requiredErrorText).not.toBeInTheDocument();
    });

    const maxLimitField = await screen.getByPlaceholderText(
      'Maximum withdrawal limit (in ether)'
    );
    userEvent.type(maxLimitField, '');
    userEvent.click(descriptionField);

    requiredErrorText = await screen.findByText('Required');
    await waitFor(() => {
      expect(requiredErrorText).toBeInTheDocument();
    });

    userEvent.type(maxLimitField, '1');
    userEvent.click(descriptionField);

    await waitDelay(100);

    userEvent.type(maxLimitField, 'a');
    userEvent.click(descriptionField);

    requiredErrorText = await screen.findByText(
      'Max withdrawal limit must be a number'
    );
    await waitFor(() => {
      expect(requiredErrorText).toBeInTheDocument();
    });
  });

  it('should display a success message if wallet was created on blockchain and backend successfully', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const RegisterWallet = require('./../register-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          { path: '/dashboard/wallets/create', element: <RegisterWallet /> },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/create', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Account123')).toBeInTheDocument();
    });

    const nameField = await screen.getByPlaceholderText('Wallet name');
    userEvent.type(nameField, 'Wallet 1');
    const descriptionField = await screen.getByPlaceholderText(
      'Wallet description'
    );
    userEvent.type(descriptionField, 'Wallet 1 description');
    const maxLimitField = await screen.getByPlaceholderText(
      'Maximum withdrawal limit (in ether)'
    );
    userEvent.type(maxLimitField, '2');

    const createBtn = screen.getByRole('button', { name: 'Create Wallet' });
    await waitFor(() => {
      expect(createBtn).not.toHaveAttribute('disabled');
    });

    userEvent.click(createBtn);

    await waitFor(() => {
      expect(
        screen.getByText(
          'Wallet created successfully. Go to the LIST tab to view wallets.'
        )
      ).toBeInTheDocument();
    });
  });

  it('should display an error message if the backend returns an error', async () => {
    mockApiCall = jest.spyOn(
      require('./../../../../utils/http/api-call'),
      'default'
    );
    mockApiCall.mockReturnValue(
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Verification failed' }),
      })
    );

    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const RegisterWallet = require('./../register-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          { path: '/dashboard/wallets/create', element: <RegisterWallet /> },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/create', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Account123')).toBeInTheDocument();
    });

    const nameField = await screen.getByPlaceholderText('Wallet name');
    userEvent.type(nameField, 'Wallet 1');
    const descriptionField = await screen.getByPlaceholderText(
      'Wallet description'
    );
    userEvent.type(descriptionField, 'Wallet 1 description');
    const maxLimitField = await screen.getByPlaceholderText(
      'Maximum withdrawal limit (in ether)'
    );
    userEvent.type(maxLimitField, '2');

    const createBtn = screen.getByRole('button', { name: 'Create Wallet' });
    await waitFor(() => {
      expect(createBtn).not.toHaveAttribute('disabled');
    });

    userEvent.click(createBtn);

    await waitFor(() => {
      expect(screen.getByText('Verification failed')).toBeInTheDocument();
    });
  });

  it('should display an error message if blockchain transaction did not return the wallet', async () => {
    class MockContract {
      constructor() {
        return {
          methods: {
            createSharedWallet: () => {
              return {
                estimateGas: () => {
                  return BigInt(10);
                },
                send: () =>
                  Promise.resolve({
                    events: {},
                  }),
              };
            },
          },
        };
      }
    }

    mockGetWeb3.mockReturnValue(
      Promise.resolve({
        eth: {
          getAccounts: () => Promise.resolve(['Account123']),
          abi: {
            encodeFunctionSignature: () => Promise.resolve(''),
          },
          estimateGas: () => Promise.resolve(BigInt(1)),
          Contract: MockContract,
        },
        utils: {
          toWei: (value: string | number) => value,
        },
      })
    );

    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const RegisterWallet = require('./../register-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          { path: '/dashboard/wallets/create', element: <RegisterWallet /> },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/create', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Account123')).toBeInTheDocument();
    });

    const nameField = await screen.getByPlaceholderText('Wallet name');
    userEvent.type(nameField, 'Wallet 1');
    const descriptionField = await screen.getByPlaceholderText(
      'Wallet description'
    );
    userEvent.type(descriptionField, 'Wallet 1 description');
    const maxLimitField = await screen.getByPlaceholderText(
      'Maximum withdrawal limit (in ether)'
    );
    userEvent.type(maxLimitField, '2');

    const createBtn = screen.getByRole('button', { name: 'Create Wallet' });
    await waitFor(() => {
      expect(createBtn).not.toHaveAttribute('disabled');
    });

    userEvent.click(createBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Wallet could not be created.')
      ).toBeInTheDocument();
    });
  });
});

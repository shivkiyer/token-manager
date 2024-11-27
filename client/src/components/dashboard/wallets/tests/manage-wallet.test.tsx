import { createMemoryRouter, RouterProvider, Outlet } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

class MockContract {
  constructor() {
    return {
      methods: {
        setWithdrawers: () => {
          return {
            estimateGas: () => {
              return BigInt(10);
            },
            send: () => Promise.resolve({ transactionHash: 'trans123' }),
          };
        },
      },
    };
  }
}

describe('ManageWallet', () => {
  let mockAuthToken: any;
  let MockRootComponent: any;
  let mockApiCall: any;
  let mockGetWeb3: any;
  let mockWalletUsers: any;
  let actualWeb3Utils: any;

  beforeEach(async () => {
    mockAuthToken = jest.spyOn(
      require('./../../../../utils/auth/auth'),
      'authToken'
    );
    mockAuthToken.mockReturnValue('token123');

    mockWalletUsers = [
      {
        id: 1,
        name: 'Account 1',
        address: 'acc1addr',
        User: {
          id: 1,
          username: 'user1@gmail.com',
        },
      },
      {
        id: 2,
        name: 'Account 2',
        address: 'acc2addr',
        User: {
          id: 2,
          username: 'user2@gmail.com',
        },
      },
    ];
    mockApiCall = jest.spyOn(
      require('./../../../../utils/http/api-call'),
      'default'
    );
    mockApiCall.mockImplementation(
      (url: string, method: string, headers: any, body: any) => {
        if (url.includes('get-users')) {
          return Promise.resolve({
            ok: true,
            json: () => {
              return {
                data: mockWalletUsers,
              };
            },
          });
        } else if (url.includes('search-users')) {
          return Promise.resolve({
            ok: true,
            json: () => {
              return {
                data: [
                  {
                    id: 3,
                    name: 'Account 3',
                    address: 'acc3addr',
                    User: {
                      id: 3,
                      username: 'user3@gmail.com',
                    },
                  },
                  {
                    id: 4,
                    name: 'Account 4',
                    address: 'acc4addr',
                    User: {
                      id: 4,
                      username: 'user4@gmail.com',
                    },
                  },
                ],
              };
            },
          });
        } else {
          return Promise.resolve({
            ok: true,
            json: () => {
              return {
                data: {
                  id: 1,
                  name: 'Wallet 1',
                  description: 'Wallet 1 description',
                  maxLimit: 2,
                  ownerId: 1,
                  address: 'wall1addr',
                  owner: {
                    id: 1,
                    name: 'Account 1',
                    address: 'acc1addr',
                    userId: 1,
                  },
                  isOwner: true,
                },
              };
            },
          });
        }
      }
    );

    mockGetWeb3 = jest.spyOn(
      require('./../../../../utils/web3/web3'),
      'default'
    );

    actualWeb3Utils = require('web3').utils;

    mockGetWeb3.mockReturnValue({
      utils: actualWeb3Utils,
      eth: {
        getBalance: () => Promise.resolve(BigInt(2000000000000000000)),
        getAccounts: () => Promise.resolve(['acc1addr']),
        estimateGas: () => Promise.resolve(BigInt(1)),
        sendTransaction: () => Promise.resolve(),
        Contract: MockContract,
      },
    });

    MockRootComponent = () => {
      return <Outlet></Outlet>;
    };
  });

  it('should display wallet info and have buttons for functions', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const manageWalletLoader =
      require('./../manage-wallet/manageWalletLoader').default;
    const ManageWallet = require('./../manage-wallet/manage-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          {
            path: '/dashboard/wallets/manage/1',
            element: <ManageWallet />,
            loader: manageWalletLoader,
          },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/manage/1', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    await waitFor(() => {
      const backLink = screen.getByText('Back to wallets');
      expect(backLink).toBeInTheDocument();
      const walletName = screen.getByText('Wallet 1');
      expect(walletName).toBeInTheDocument();
      const walletDescription = screen.getByText('Wallet 1 description');
      expect(walletDescription).toBeInTheDocument();
      const depositEtherBtn = screen.getByRole('button', {
        name: 'Deposit Ether',
      });
      expect(depositEtherBtn).toBeInTheDocument();
      const addUsersBtn = screen.getByRole('button', { name: 'Add Users' });
      expect(addUsersBtn).toBeInTheDocument();
      const removeUsersBtn = screen.getByRole('button', {
        name: 'Remove Users',
      });
      expect(removeUsersBtn).toBeInTheDocument();
      const etherBalance = screen.getByTestId('test-ether-balance');
      expect(etherBalance.innerHTML).toContain('2');
    });
  });

  it('should list the users of the wallet', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const manageWalletLoader =
      require('./../manage-wallet/manageWalletLoader').default;
    const ManageWallet = require('./../manage-wallet/manage-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          {
            path: '/dashboard/wallets/manage/1',
            element: <ManageWallet />,
            loader: manageWalletLoader,
          },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/manage/1', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    await waitFor(() => {
      const walletAccountUser1 = screen.getByText('user1@gmail.com');
      expect(walletAccountUser1).toBeInTheDocument();
      const walletAccountUser2 = screen.getByText('user2@gmail.com');
      expect(walletAccountUser2).toBeInTheDocument();
      const walletAccount1 = screen.getByText('Account 1');
      expect(walletAccount1).toBeInTheDocument();
      const walletAccount2 = screen.getByText('Account 2');
      expect(walletAccount2).toBeInTheDocument();
    });
  });

  it('should display a form for depositing ether when Deposit Ether button is clicked', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const manageWalletLoader =
      require('./../manage-wallet/manageWalletLoader').default;
    const ManageWallet = require('./../manage-wallet/manage-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          {
            path: '/dashboard/wallets/manage/1',
            element: <ManageWallet />,
            loader: manageWalletLoader,
          },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/manage/1', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    let depositEtherBtn: any;
    await waitFor(() => {
      depositEtherBtn = screen.getByRole('button', {
        name: 'Deposit Ether',
      });
      expect(depositEtherBtn).toBeInTheDocument();
    });

    userEvent.click(depositEtherBtn);

    await waitFor(() => {
      const etherForm = screen.getByPlaceholderText('Amount in Ether');
      expect(etherForm).toBeInTheDocument();
      const depositBtn = screen.getByRole('button', { name: 'Deposit' });
      expect(depositBtn).toBeInTheDocument();
    });
  });

  it('should display errors if incorrect values of Ether are entered to be deposited in wallet', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const manageWalletLoader =
      require('./../manage-wallet/manageWalletLoader').default;
    const ManageWallet = require('./../manage-wallet/manage-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          {
            path: '/dashboard/wallets/manage/1',
            element: <ManageWallet />,
            loader: manageWalletLoader,
          },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/manage/1', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    let depositEtherBtn: any;
    await waitFor(() => {
      depositEtherBtn = screen.getByRole('button', {
        name: 'Deposit Ether',
      });
      expect(depositEtherBtn).toBeInTheDocument();
    });

    userEvent.click(depositEtherBtn);

    let etherForm: any;
    let depositBtn: any;
    await waitFor(() => {
      etherForm = screen.getByPlaceholderText('Amount in Ether');
      expect(etherForm).toBeInTheDocument();
      depositBtn = screen.getByRole('button', { name: 'Deposit' });
      expect(depositBtn).toBeInTheDocument();
    });

    userEvent.type(etherForm, 'a');
    userEvent.click(depositBtn);

    await waitFor(() => {
      const errMsg = screen.getByText('Ether value must be a number');
      expect(errMsg).toBeInTheDocument();
    });

    userEvent.clear(etherForm);
    userEvent.click(etherForm);
    userEvent.click(depositBtn);

    await waitFor(() => {
      const errMsg = screen.getByText('Required');
      expect(errMsg).toBeInTheDocument();
    });

    userEvent.type(etherForm, '-0.1');
    userEvent.click(depositBtn);

    await waitFor(() => {
      const errMsg = screen.getByText('Ether value must be positive');
      expect(errMsg).toBeInTheDocument();
    });
  });

  it('should display an error if the Linked Metamask account is not wallet owner', async () => {
    mockGetWeb3.mockReturnValue({
      utils: actualWeb3Utils,
      eth: {
        getBalance: () => Promise.resolve(BigInt(2000000000000000000)),
        getAccounts: () => Promise.resolve(['acc2addr']),
        estimateGas: () => Promise.resolve(BigInt(1)),
        sendTransaction: () => Promise.resolve(),
        Contract: MockContract,
      },
    });
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const manageWalletLoader =
      require('./../manage-wallet/manageWalletLoader').default;
    const ManageWallet = require('./../manage-wallet/manage-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          {
            path: '/dashboard/wallets/manage/1',
            element: <ManageWallet />,
            loader: manageWalletLoader,
          },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/manage/1', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    let depositEtherBtn: any;
    await waitFor(() => {
      depositEtherBtn = screen.getByRole('button', {
        name: 'Deposit Ether',
      });
      expect(depositEtherBtn).toBeInTheDocument();
    });

    userEvent.click(depositEtherBtn);

    let etherForm: any;
    let depositBtn: any;
    await waitFor(() => {
      etherForm = screen.getByPlaceholderText('Amount in Ether');
      expect(etherForm).toBeInTheDocument();
      depositBtn = screen.getByRole('button', { name: 'Deposit' });
      expect(depositBtn).toBeInTheDocument();
    });

    userEvent.type(etherForm, '1.25');
    userEvent.click(depositBtn);

    await waitFor(() => {
      const errMsg = screen.getByText(
        'Linked Metamask account is not the wallet owner'
      );
      expect(errMsg).toBeInTheDocument();
    });

    screen.debug();
  });

  it('should close Ether deposit form after clicking Deposit button', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const manageWalletLoader =
      require('./../manage-wallet/manageWalletLoader').default;
    const ManageWallet = require('./../manage-wallet/manage-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          {
            path: '/dashboard/wallets/manage/1',
            element: <ManageWallet />,
            loader: manageWalletLoader,
          },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/manage/1', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    let depositEtherBtn: any;
    await waitFor(() => {
      depositEtherBtn = screen.getByRole('button', {
        name: 'Deposit Ether',
      });
      expect(depositEtherBtn).toBeInTheDocument();
    });

    userEvent.click(depositEtherBtn);

    let etherForm: any;
    let depositBtn: any;
    await waitFor(() => {
      etherForm = screen.getByPlaceholderText('Amount in Ether');
      expect(etherForm).toBeInTheDocument();
      depositBtn = screen.getByRole('button', { name: 'Deposit' });
      expect(depositBtn).toBeInTheDocument();
    });

    userEvent.type(etherForm, '1.25');
    userEvent.click(depositBtn);

    await waitFor(() => {
      etherForm = screen.queryByPlaceholderText('Amount in Ether');
      expect(etherForm).not.toBeInTheDocument();
    });
  });

  it('should display a user/account seach text field when Add Users button is clicked', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const manageWalletLoader =
      require('./../manage-wallet/manageWalletLoader').default;
    const ManageWallet = require('./../manage-wallet/manage-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          {
            path: '/dashboard/wallets/manage/1',
            element: <ManageWallet />,
            loader: manageWalletLoader,
          },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/manage/1', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    let addUsersBtn: any;
    await waitFor(() => {
      addUsersBtn = screen.getByRole('button', { name: 'Add Users' });
      expect(addUsersBtn).toBeInTheDocument();
    });

    userEvent.click(addUsersBtn);

    await waitFor(() => {
      const searchField = screen.getByPlaceholderText(
        'Username or Account Name or Account Address'
      );
      expect(searchField).toBeInTheDocument();
      const searchIconBtn = screen.getByTestId('SearchIcon');
      expect(searchIconBtn).toBeInTheDocument();
      const closeIconBtn = screen.getByTestId('CloseIcon');
      expect(closeIconBtn).toBeInTheDocument();
    });
  });

  it('should display a table of accounts when search icon button is clicked', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const manageWalletLoader =
      require('./../manage-wallet/manageWalletLoader').default;
    const ManageWallet = require('./../manage-wallet/manage-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          {
            path: '/dashboard/wallets/manage/1',
            element: <ManageWallet />,
            loader: manageWalletLoader,
          },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/manage/1', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    let addUsersBtn: any;
    await waitFor(() => {
      addUsersBtn = screen.getByRole('button', { name: 'Add Users' });
      expect(addUsersBtn).toBeInTheDocument();
    });

    userEvent.click(addUsersBtn);

    let searchField: any;
    let searchIconBtn: any;
    await waitFor(() => {
      searchField = screen.getByPlaceholderText(
        'Username or Account Name or Account Address'
      );
      expect(searchField).toBeInTheDocument();
      searchIconBtn = screen.getByTestId('SearchIcon');
      expect(searchIconBtn).toBeInTheDocument();
    });

    userEvent.type(searchField, 'abc');
    userEvent.click(searchIconBtn);

    await waitFor(() => {
      const walletAccountUser1 = screen.getByText('user3@gmail.com');
      expect(walletAccountUser1).toBeInTheDocument();
      const walletAccountUser2 = screen.getByText('user4@gmail.com');
      expect(walletAccountUser2).toBeInTheDocument();
      const walletAccount1 = screen.getByText('Account 3');
      expect(walletAccount1).toBeInTheDocument();
      const walletAccount2 = screen.getByText('Account 4');
      expect(walletAccount2).toBeInTheDocument();
    });
  });

  it('should display an error if Add button is clicked without selecting a user in search table', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const manageWalletLoader =
      require('./../manage-wallet/manageWalletLoader').default;
    const ManageWallet = require('./../manage-wallet/manage-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          {
            path: '/dashboard/wallets/manage/1',
            element: <ManageWallet />,
            loader: manageWalletLoader,
          },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/manage/1', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    let addUsersBtn: any;
    await waitFor(() => {
      addUsersBtn = screen.getByRole('button', { name: 'Add Users' });
      expect(addUsersBtn).toBeInTheDocument();
    });

    userEvent.click(addUsersBtn);

    let searchField: any;
    let searchIconBtn: any;
    await waitFor(() => {
      searchField = screen.getByPlaceholderText(
        'Username or Account Name or Account Address'
      );
      expect(searchField).toBeInTheDocument();
      searchIconBtn = screen.getByTestId('SearchIcon');
      expect(searchIconBtn).toBeInTheDocument();
    });

    userEvent.type(searchField, 'abc');
    userEvent.click(searchIconBtn);

    let addBtn: any;
    await waitFor(() => {
      addBtn = screen.getByRole('button', { name: 'Add' });
      expect(addBtn).toBeInTheDocument();
    });

    userEvent.click(addBtn);

    await waitFor(() => {
      const addErrorMsg = screen.getByText('No account selected');
      expect(addErrorMsg).toBeInTheDocument();
    });
  });

  it('should close the user search table after the Add button is clicked', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const manageWalletLoader =
      require('./../manage-wallet/manageWalletLoader').default;
    const ManageWallet = require('./../manage-wallet/manage-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          {
            path: '/dashboard/wallets/manage/1',
            element: <ManageWallet />,
            loader: manageWalletLoader,
          },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/manage/1', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    let addUsersBtn: any;
    await waitFor(() => {
      addUsersBtn = screen.getByRole('button', { name: 'Add Users' });
      expect(addUsersBtn).toBeInTheDocument();
    });

    userEvent.click(addUsersBtn);

    let searchField: any;
    let searchIconBtn: any;
    await waitFor(() => {
      searchField = screen.getByPlaceholderText(
        'Username or Account Name or Account Address'
      );
      expect(searchField).toBeInTheDocument();
      searchIconBtn = screen.getByTestId('SearchIcon');
      expect(searchIconBtn).toBeInTheDocument();
    });

    userEvent.type(searchField, 'abc');
    userEvent.click(searchIconBtn);

    let userSelectCheckBox: any;
    let addBtn: any;
    await waitFor(() => {
      addBtn = screen.getByRole('button', { name: 'Add' });
      expect(addBtn).toBeInTheDocument();
      userSelectCheckBox = screen.getAllByRole('checkbox');
      expect(
        userSelectCheckBox[userSelectCheckBox.length - 1]
      ).toBeInTheDocument();
    });

    userEvent.click(userSelectCheckBox[userSelectCheckBox.length - 1]);

    userEvent.click(addBtn);

    await waitFor(() => {
      const addUserBtn = screen.queryByRole('button', { name: 'Add' });
      expect(addUserBtn).not.toBeInTheDocument();
    });
  });

  it('should display an error if Metamask account used for adding user to wallet is not the same as wallet owner', async () => {
    mockGetWeb3.mockReturnValue({
      utils: actualWeb3Utils,
      eth: {
        getBalance: () => Promise.resolve(BigInt(2000000000000000000)),
        getAccounts: () => Promise.resolve(['acc2addr']),
        estimateGas: () => Promise.resolve(BigInt(1)),
        sendTransaction: () => Promise.resolve(),
        Contract: MockContract,
      },
    });
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const manageWalletLoader =
      require('./../manage-wallet/manageWalletLoader').default;
    const ManageWallet = require('./../manage-wallet/manage-wallet').default;

    const routes = [
      {
        path: '/',
        id: 'root-app',
        loader: mockAuthToken,
        element: <MockRootComponent />,
        children: [
          {
            path: '/dashboard/wallets/manage/1',
            element: <ManageWallet />,
            loader: manageWalletLoader,
          },
        ],
      },
    ];

    const router = createMemoryRouter(routes as any, {
      initialEntries: ['/dashboard/wallets/manage/1', '/'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    let addUsersBtn: any;
    await waitFor(() => {
      addUsersBtn = screen.getByRole('button', { name: 'Add Users' });
      expect(addUsersBtn).toBeInTheDocument();
    });

    userEvent.click(addUsersBtn);

    let searchField: any;
    let searchIconBtn: any;
    await waitFor(() => {
      searchField = screen.getByPlaceholderText(
        'Username or Account Name or Account Address'
      );
      expect(searchField).toBeInTheDocument();
      searchIconBtn = screen.getByTestId('SearchIcon');
      expect(searchIconBtn).toBeInTheDocument();
    });

    userEvent.type(searchField, 'abc');
    userEvent.click(searchIconBtn);

    let userSelectCheckBox: any;
    let addBtn: any;
    await waitFor(() => {
      addBtn = screen.getByRole('button', { name: 'Add' });
      expect(addBtn).toBeInTheDocument();
      userSelectCheckBox = screen.getAllByRole('checkbox');
      expect(
        userSelectCheckBox[userSelectCheckBox.length - 1]
      ).toBeInTheDocument();
    });

    userEvent.click(userSelectCheckBox[userSelectCheckBox.length - 1]);

    userEvent.click(addBtn);

    await waitFor(() => {
      const userAddError = screen.getByText(
        'Linked Metamask account is not the wallet owner'
      );
      expect(userAddError).toBeInTheDocument();
    });
  });
});

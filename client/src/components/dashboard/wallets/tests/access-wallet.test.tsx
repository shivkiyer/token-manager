import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import waitDelay from '../../../../test-utils/wait-delay';

class MockContract {
  constructor() {
    return {
      methods: {
        withdraw: () => {
          return {
            estimateGas: () => Promise.resolve(BigInt(1)),
            send: () => Promise.resolve({ transactionHash: 'trans123' }),
          };
        },
      },
    };
  }
}

describe('Access wallet test', () => {
  let mockAuthToken: any;
  let mockClearToken: any;
  let mockApiCall: any;
  let mockWeb3: any;
  let mockFormatEthAddress: any;

  beforeEach(() => {
    mockAuthToken = jest.spyOn(
      require('./../../../../utils/auth/auth'),
      'authToken'
    );
    mockAuthToken.mockReturnValue('token123');

    mockClearToken = jest.spyOn(
      require('./../../../../utils/auth/auth'),
      'clearToken'
    );
    mockClearToken.mockImplementation(jest.fn());

    mockApiCall = jest.spyOn(
      require('./../../../../utils/http/api-call'),
      'default'
    );
    mockApiCall.mockReturnValue(
      Promise.resolve({
        json: () => {
          return Promise.resolve({
            data: {
              id: 1,
              name: 'Wallet 1',
              description: 'Wallet 1 description',
              address: 'walletaddr123',
              maxLimit: 2.5,
              owner: {
                id: 1,
                address: 'acc3',
              },
              user: [
                {
                  address: 'acc1',
                  name: 'Account 1',
                  User: { id: 1, username: 'abc1@gmail.com' },
                },
                {
                  address: 'acc2',
                  name: 'Account 2',
                  User: { id: 2, username: 'abc2@gmail.com' },
                },
              ],
            },
          });
        },
      })
    );

    mockWeb3 = jest.spyOn(require('./../../../../utils/web3/web3'), 'default');
    mockWeb3.mockReturnValue({
      eth: {
        getAccounts: () => Promise.resolve(['acc1']),
        Contract: MockContract,
      },
      utils: {
        toWei: () => BigInt(2),
      },
    });

    mockFormatEthAddress = jest.spyOn(
      require('./../../../../utils/web3/formatEthAddress'),
      'default'
    );
    mockFormatEthAddress.mockImplementation(
      (address: any, always: any): any => {
        return address;
      }
    );
  });

  it('should display wallet info and a withdrawal form', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const walletDetailLoader = require('./../walletDetailLoader').default;
    const AccessWallet = require('./../access-wallet/access-wallet').default;

    const routes = [
      {
        path: '/wallet/access/1',
        element: <AccessWallet />,
        loader: walletDetailLoader,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/wallet/access/1'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    await waitFor(() => {
      const testOwner = screen.getByText('acc3');
      expect(testOwner).toBeInTheDocument();
      const userAddress1 = screen.getByText('acc1');
      expect(userAddress1).toBeInTheDocument();
      const userAddress2 = screen.getByText('acc2');
      expect(userAddress2).toBeInTheDocument();
      const withdrawField = screen.getByLabelText('Amount in Ether');
      expect(withdrawField).toBeInTheDocument();
      const submitBtn = screen.getByRole('button', { name: 'Submit' });
      expect(submitBtn).toBeInTheDocument();
    });
  });

  it('should display an error message if linked Metamask account is not in the user list', async () => {
    mockWeb3.mockReturnValue({
      eth: {
        getAccounts: () => Promise.resolve(['acc4']),
        Contract: MockContract,
      },
      utils: {
        toWei: () => BigInt(2),
      },
    });

    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const walletDetailLoader = require('./../walletDetailLoader').default;
    const AccessWallet = require('./../access-wallet/access-wallet').default;

    const routes = [
      {
        path: '/wallet/access/1',
        element: <AccessWallet />,
        loader: walletDetailLoader,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/wallet/access/1'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    await waitFor(() => {
      const errMsg = screen.getByText(
        'Linked Metamask account is not a wallet user'
      );
      expect(errMsg).toBeInTheDocument();
    });
  });

  it('should display an error message if withdrawal amount is greater than maximum allowed', async () => {
    const Web3ContextProvider =
      require('./../../../../app/context/web3-context-provider').default;
    const walletDetailLoader = require('./../walletDetailLoader').default;
    const AccessWallet = require('./../access-wallet/access-wallet').default;

    const routes = [
      {
        path: '/wallet/access/1',
        element: <AccessWallet />,
        loader: walletDetailLoader,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/wallet/access/1'],
      initialIndex: 0,
    });

    render(
      <Web3ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </Web3ContextProvider>
    );

    let withdrawField: any;
    let submitBtn: any;
    await waitFor(() => {
      withdrawField = screen.getByLabelText('Amount in Ether');
      expect(withdrawField).toBeInTheDocument();
      submitBtn = screen.getByRole('button', { name: 'Submit' });
      expect(submitBtn).toBeInTheDocument();
    });

    userEvent.type(withdrawField, '2.55');
    userEvent.click(submitBtn);

    await waitFor(() => {
      const errMsg = screen.getByText(
        'amount must be less than or equal to 2.5'
      );
      expect(errMsg).toBeInTheDocument();
    });
  });
});

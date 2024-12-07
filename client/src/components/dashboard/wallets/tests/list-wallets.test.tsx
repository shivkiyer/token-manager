import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

describe('ListWallets', () => {
  let mockAuthToken: any;
  let mockApiCall: any;

  beforeEach(() => {
    mockAuthToken = jest.spyOn(
      require('./../../../../utils/auth/auth'),
      'authToken'
    );
    mockAuthToken.mockReturnValue('token123');

    mockApiCall = jest.spyOn(
      require('./../../../../utils/http/api-call'),
      'default'
    );
  });

  it('should display a wallet if backend returns a wallet', async () => {
    const response = new Response(
      JSON.stringify({
        data: [
          {
            name: 'Wallet 1',
            description: 'Wallet description 1',
            address: 'Address123',
            maxLimit: 3,
          },
        ],
      }),
      { status: 200 }
    );
    mockApiCall.mockReturnValue(Promise.resolve(response));
    const walletsListLoader = require('./../list-wallets/walletsListLoader').default;
    const ListWallets = require('./../list-wallets/list-wallets').default;

    const routes = [
      {
        path: '/dashboard/wallets/list',
        element: <ListWallets />,
        loader: walletsListLoader,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard/wallets/list'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router}></RouterProvider>);

    await waitFor(() => {
      expect(screen.getByText('Wallet 1')).toBeInTheDocument();
      expect(screen.getByText('Wallet description 1')).toBeInTheDocument();
      expect(screen.getByText('Address123')).toBeInTheDocument();
    });
  });

  it('should display a wallet if backend returns a wallet', async () => {
    const response = new Response(
      JSON.stringify({
        data: [
          {
            name: 'Wallet 1',
            description: 'Wallet description 1',
            address: 'Address123',
            maxLimit: 3,
          },
          {
            name: 'Wallet 2',
            description: 'Wallet description 2',
            address: 'Address456',
            maxLimit: 2,
          },
        ],
      }),
      { status: 200 }
    );
    mockApiCall.mockReturnValue(Promise.resolve(response));
    const walletsListLoader = require('./../list-wallets/walletsListLoader').default;
    const ListWallets = require('./../list-wallets/list-wallets').default;

    const routes = [
      {
        path: '/dashboard/wallets/list',
        element: <ListWallets />,
        loader: walletsListLoader,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard/wallets/list'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router}></RouterProvider>);

    await waitFor(() => {
      expect(screen.getByText('Wallet 1')).toBeInTheDocument();
      expect(screen.getByText('Wallet 2')).toBeInTheDocument();
    });
  });

  it('should display an error message if the backend returns an error', async () => {
    const response = new Response(
      JSON.stringify({
        message: 'Test backend error',
      }),
      { status: 400 }
    );
    mockApiCall.mockReturnValue(Promise.resolve(response));
    const walletsListLoader = require('./../list-wallets/walletsListLoader').default;
    const ListWallets = require('./../list-wallets/list-wallets').default;

    const routes = [
      {
        path: '/dashboard/wallets/list',
        element: <ListWallets />,
        loader: walletsListLoader,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard/wallets/list'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router}></RouterProvider>);

    await waitFor(() => {
      expect(screen.getByText('Test backend error')).toBeInTheDocument();
    });
  });

  it('should redirect to the login page if backend returns a 403', async () => {
    const response = new Response(
      JSON.stringify({
        message: 'Authorization failed',
      }),
      { status: 403 }
    );
    mockApiCall.mockReturnValue(Promise.resolve(response));
    const walletsListLoader = require('./../list-wallets/walletsListLoader').default;
    const ListWallets = require('./../list-wallets/list-wallets').default;

    const MockLogin = () => {
      return <p>Mock Login</p>;
    };

    const routes = [
      {
        path: '/dashboard/wallets/list',
        element: <ListWallets />,
        loader: walletsListLoader,
      },
      {
        path: '/login',
        element: <MockLogin />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard/wallets/list'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router}></RouterProvider>);

    await waitFor(() => {
      expect(screen.getByText('Mock Login')).toBeInTheDocument();
    });
  });
});

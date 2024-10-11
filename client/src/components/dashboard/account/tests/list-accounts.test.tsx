import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

describe('ListAccounts', () => {
  it('should display account cards if backend returns accounts for user', async () => {
    const mockAuthToken = jest.spyOn(
      require('./../../../../utils/auth/auth'),
      'authToken'
    );
    mockAuthToken.mockReturnValue('token123');
    const mockApiCall = jest.spyOn(
      require('./../../../../utils/http/api-call'),
      'default'
    );
    const mockAccounts = [
      { accountId: 1, accountName: 'Acc1', accountAddress: 'Addr1' },
      { accountId: 2, accountName: 'Acc2', accountAddress: 'Addr2' },
    ];
    const response = new Response(JSON.stringify({ data: mockAccounts }), {
      status: 200,
    });
    mockApiCall.mockReturnValue(Promise.resolve(response));
    const accountsListLoader = require('./../accountsListLoader').default;
    const ListAccounts = require('./../list-accounts').default;
    const routes = [
      {
        path: '/dashboard/account',
        element: <ListAccounts />,
        loader: accountsListLoader,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard/account'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router}></RouterProvider>);

    await waitFor(() => {
      expect(screen.getByText('Acc1')).toBeInTheDocument();
      expect(screen.getByText(/Addr1/i)).toBeInTheDocument();
      expect(screen.getByText('Acc2')).toBeInTheDocument();
      expect(screen.getByText(/Addr2/i)).toBeInTheDocument();
    });
  });

  it('should redirect to login page if user not authenticated', async () => {
    const mockAuthToken = jest.spyOn(
      require('./../../../../utils/auth/auth'),
      'authToken'
    );
    mockAuthToken.mockReturnValue(null);
    const mockApiCall = jest.spyOn(
      require('./../../../../utils/http/api-call'),
      'default'
    );
    const mockAccounts = [
      { accountId: 1, accountName: 'Acc1', accountAddress: 'Addr1' },
      { accountId: 2, accountName: 'Acc2', accountAddress: 'Addr2' },
    ];
    const response = new Response(JSON.stringify({ data: mockAccounts }), {
      status: 200,
    });
    mockApiCall.mockReturnValue(Promise.resolve(response));
    const accountsListLoader = require('./../accountsListLoader').default;
    const ListAccounts = require('./../list-accounts').default;
    const MockLoginPage = () => {
        return (<p>Login page</p>)
    }
    const routes = [
      {
        path: '/dashboard/account',
        element: <ListAccounts />,
        loader: accountsListLoader,
      },
      {
        path: '/login',
        element: <MockLoginPage />
      }
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard/account'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router}></RouterProvider>);

    await waitFor(() => {
      expect(screen.getByText('Login page')).toBeInTheDocument();
    });
  });

  it('should display an error message if the backend returns an error', async () => {
    const mockAuthToken = jest.spyOn(
      require('./../../../../utils/auth/auth'),
      'authToken'
    );
    mockAuthToken.mockReturnValue('token123');
    const mockApiCall = jest.spyOn(
      require('./../../../../utils/http/api-call'),
      'default'
    );
    const response = new Response(JSON.stringify({ message: 'Backend error' }), {
      status: 400,
    });
    mockApiCall.mockReturnValue(Promise.resolve(response));
    const accountsListLoader = require('./../accountsListLoader').default;
    const ListAccounts = require('./../list-accounts').default;
    const MockLoginPage = () => {
        return (<p>Login page</p>)
    }
    const routes = [
      {
        path: '/dashboard/account',
        element: <ListAccounts />,
        loader: accountsListLoader,
      },
      {
        path: '/login',
        element: <MockLoginPage />
      }
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard/account'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router}></RouterProvider>);

    await waitFor(() => {
      expect(screen.getByText('Backend error')).toBeInTheDocument();
    });
  });
});

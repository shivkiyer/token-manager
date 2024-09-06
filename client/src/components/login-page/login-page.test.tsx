import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import Dashboard from '../dashboard/dashboard';

jest.useFakeTimers();

describe('LoginPage', () => {
  it('should display the login form with username/password and disabled Login button', async () => {
    const mockResponse = new Response('sometoken', { status: 200 });
    jest.mock('./../../utils/http/api-call', () =>
      Promise.resolve(mockResponse)
    );
    const LoginPage = require('./login-page').default;
    const loginActionHandler = require('./login-action-handler').default;

    const routes = [
      { path: '/login', element: <LoginPage />, action: loginActionHandler },
      { path: '/dashboard', element: <Dashboard /> },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/login'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router}></RouterProvider>);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      const loginBtn = screen.getByRole('button', { name: 'Login' });
      expect(loginBtn).toBeInTheDocument();
      expect(loginBtn).toHaveAttribute('disabled');
    });
  });

  it('should display an invalid email error for invalid usernames', async () => {
    const mockResponse = new Response('sometoken', { status: 200 });
    jest.mock('./../../utils/http/api-call', () =>
      Promise.resolve(mockResponse)
    );
    const LoginPage = require('./login-page').default;
    const loginActionHandler = require('./login-action-handler').default;

    const routes = [
      { path: '/login', element: <LoginPage />, action: loginActionHandler },
      { path: '/dashboard', element: <Dashboard /> },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/login'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router}></RouterProvider>);

    let usernameField: any;
    await waitFor(() => {
      usernameField = screen.getByPlaceholderText('Username');
      userEvent.type(usernameField, 'abc');
    });

    jest.runAllTimers();

    await waitFor(() => {
      const errMessage = screen.getByText('Not a valid email');
      expect(errMessage).toBeInTheDocument();
    });
  });
});

export {};

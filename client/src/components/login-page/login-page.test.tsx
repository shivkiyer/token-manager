import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

jest.useFakeTimers();

describe('LoginPage', () => {
  let MockDashboard: any;
  let router: any;
  beforeEach(() => {
    MockDashboard = () => {
      return <p>Dashboard here</p>;
    };

    const mockResponse = new Response(JSON.stringify({ data: 'token' }), {
      status: 200,
    });
    jest.mock(
      './../../utils/http/api-call',
      () => () => Promise.resolve(mockResponse)
    );

    const LoginPage = require('./login-page').default;
    const loginActionHandler = require('./login-action-handler').default;

    const routes = [
      { path: '/login', element: <LoginPage />, action: loginActionHandler },
      { path: '/dashboard', element: <MockDashboard /> },
    ];

    router = createMemoryRouter(routes, {
      initialEntries: ['/login'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router}></RouterProvider>);
  });

  it('should display the login form with username/password and disabled Login button', async () => {
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      const loginBtn = screen.getByRole('button', { name: 'Login' });
      expect(loginBtn).toBeInTheDocument();
      expect(loginBtn).toHaveAttribute('disabled');
    });
  });

  it('should display an invalid email error for invalid usernames', async () => {
    let usernameField: any;
    await waitFor(() => {
      usernameField = screen.getByPlaceholderText('Username');
    });

    userEvent.type(usernameField, 'abc');

    jest.runAllTimers();

    await waitFor(() => {
      const errMessage = screen.getByText('Not a valid email');
      expect(errMessage).toBeInTheDocument();
    });
  });

  it('should redirect to dashboard upon successful login', async () => {
    await waitFor(() => {});
    const usernameField = screen.getByPlaceholderText('Username');
    userEvent.type(usernameField, 'abc@gmail.com');
    const passwordField = screen.getByPlaceholderText('Password');
    userEvent.type(passwordField, 'xyz');

    let loginBtn = screen.getByRole('button', { name: 'Login' });
    await waitFor(() => {
      expect(loginBtn).not.toHaveAttribute('disabled');
    });

    userEvent.click(loginBtn);

    jest.runAllTimers();

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/dashboard');
    });

    const dashboard = screen.getByText('Dashboard here');

    await waitFor(() => {
      expect(dashboard).toBeInTheDocument();
    });
  });
});

export {};

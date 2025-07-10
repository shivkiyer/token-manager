import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Tests for the login page
 */
describe('LoginPage', () => {
  let mockLoginActionHandler: any;

  beforeAll(() => {
    const loginUtil = require('@/actions/auth/login');
    mockLoginActionHandler = jest.spyOn(loginUtil, 'default');
    mockLoginActionHandler.mockImplementation(() => {
      return Promise.resolve({ message: '' });
    });
  });

  beforeEach(() => {
    jest.mock('next/navigation', () => {
      return {
        useRouter: jest.fn(),
      };
    });

    const sessionUtils = require('@/actions/auth/session');
    const mockGetSession = jest.spyOn(sessionUtils, 'getSession');
    mockGetSession.mockReturnValue(Promise.resolve(null));
  });

  it('should display a login form with a disabled Login button', async () => {
    const LoginComponent = require('./page').default;

    render(<LoginComponent />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      const submitBtn = screen.getByRole('button', { name: 'Login' });
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();
    });
  });

  it('should make Login btn active if email and password are entered', async () => {
    const LoginComponent = require('./page').default;

    render(<LoginComponent />);
    let usernameField: any, passwordField: any;
    await waitFor(() => {
      usernameField = screen.getByPlaceholderText('Username');
      passwordField = screen.getByPlaceholderText('Password');
      expect(usernameField).toBeInTheDocument();
      expect(passwordField).toBeInTheDocument();
    });
    await userEvent.type(usernameField, 'someemail@gmail.com');
    await userEvent.type(passwordField, 'somepassword');
    await waitFor(() => {
      const submitBtn = screen.getByRole('button', { name: 'Login' });
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).not.toBeDisabled();
    });
  });

  it('should call the loginActionHandler method if user clicks on Login button', async () => {
    const LoginComponent = require('./page').default;

    render(<LoginComponent />);
    let usernameField: any, passwordField: any;
    await waitFor(() => {
      usernameField = screen.getByPlaceholderText('Username');
      passwordField = screen.getByPlaceholderText('Password');
      expect(usernameField).toBeInTheDocument();
      expect(passwordField).toBeInTheDocument();
    });
    await userEvent.type(usernameField, 'someemail@gmail.com');
    await userEvent.type(passwordField, 'somepassword');
    let submitBtn: any;
    await waitFor(() => {
      submitBtn = screen.getByRole('button', { name: 'Login' });
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).not.toBeDisabled();
    });

    await waitFor(async () => {
      await submitBtn.click();
    });
    await waitFor(() => {
      expect(mockLoginActionHandler).toHaveBeenCalled();
    });
  });

  it('should display an error if an invalid email is entered', async () => {
    const LoginComponent = require('./page').default;

    render(<LoginComponent />);
    let usernameField: any, passwordField: any;
    await waitFor(() => {
      usernameField = screen.getByPlaceholderText('Username');
      passwordField = screen.getByPlaceholderText('Password');
      expect(usernameField).toBeInTheDocument();
      expect(passwordField).toBeInTheDocument();
    });
    await userEvent.type(usernameField, 'someemail');
    await userEvent.type(passwordField, 'somepassword');
    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      const submitBtn = screen.getByRole('button', { name: 'Login' });
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();
    });
  });

  it('should display an error if username is not entered', async () => {
    const LoginComponent = require('./page').default;

    render(<LoginComponent />);
    let usernameField: any, passwordField: any;
    await waitFor(() => {
      usernameField = screen.getByPlaceholderText('Username');
      passwordField = screen.getByPlaceholderText('Password');
      expect(usernameField).toBeInTheDocument();
      expect(passwordField).toBeInTheDocument();
    });
    await userEvent.click(usernameField);
    await userEvent.type(passwordField, 'somepassword');
    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument();
      const submitBtn = screen.getByRole('button', { name: 'Login' });
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();
    });
  });

  it('should display an error if password is not entered', async () => {
    const LoginComponent = require('./page').default;

    render(<LoginComponent />);
    let usernameField: any, passwordField: any;
    await waitFor(() => {
      usernameField = screen.getByPlaceholderText('Username');
      passwordField = screen.getByPlaceholderText('Password');
      expect(usernameField).toBeInTheDocument();
      expect(passwordField).toBeInTheDocument();
    });
    await userEvent.type(usernameField, 'someemail@gmail.com');
    await userEvent.click(passwordField);
    await userEvent.click(usernameField);
    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument();
      const submitBtn = screen.getByRole('button', { name: 'Login' });
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();
    });
  });
});

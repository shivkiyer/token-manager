import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('RegisterAccount', () => {
  let RegisterAccount: any;
  let Web3Context: any;
  let testContextValue: any;

  beforeEach(async () => {
    jest.mock('./../../../../hooks/useTokenAuthentication', () => {
      return jest.fn().mockReturnValue('token123');
    });
    const mockGetWeb3 = jest.spyOn(
      require('./../../../../utils/web3/web3'),
      'default'
    );
    mockGetWeb3.mockReturnValue(() => {
      return {
        eth: {
          getAccounts: () => Promise.resolve(['test']),
        },
      };
    });
    Web3Context =
      require('./../../../../app/context/web3-context-provider').Web3Context;
    testContextValue = {
      web3: {
        eth: {
          getAccounts: () => Promise.resolve(['test']),
        },
      },
    };
  });

  it('should display empty account addition form with disabled Add button', async () => {
    RegisterAccount = require('./../register-account').default;
    render(
      <Web3Context.Provider value={testContextValue}>
        <RegisterAccount />
      </Web3Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Address')).toBeInTheDocument();
      const btn = screen.getByRole('button', { name: 'Add' });
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveAttribute('disabled');
    });
  });

  it('should enable the Add button when name and address fields are filled', async () => {
    RegisterAccount = require('./../register-account').default;
    render(
      <Web3Context.Provider value={testContextValue}>
        <RegisterAccount />
      </Web3Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    });

    const nameField = screen.getByPlaceholderText('Name');
    userEvent.type(nameField, 'test');
    const addressField = screen.getByPlaceholderText('Address');
    userEvent.type(addressField, 'test');

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: 'Add' });
      expect(btn).toBeInTheDocument();
      expect(btn).not.toHaveAttribute('disabled');
    });
  });

  it('should display an error if entered address is different from addresses linked from Metamask', async () => {
    testContextValue = {
      web3: {
        eth: {
          getAccounts: () => Promise.resolve(['acc']),
        },
      },
    };

    RegisterAccount = require('./../register-account').default;
    render(
      <Web3Context.Provider value={testContextValue}>
        <RegisterAccount />
      </Web3Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    });

    const nameField = screen.getByPlaceholderText('Name');
    userEvent.type(nameField, 'test');
    const addressField = screen.getByPlaceholderText('Address');
    userEvent.type(addressField, 'test');

    let btn: any;
    await waitFor(() => {
      btn = screen.getByRole('button', { name: 'Add' });
      expect(btn).toBeInTheDocument();
      expect(btn).not.toHaveAttribute('disabled');
    });

    userEvent.click(btn);

    await waitFor(() => {
      expect(
        screen.getByText('Account is not linked in Metamask.')
      ).toBeInTheDocument();
    });
  });

  it('should display an error message if backend returns an error response', async () => {
    const mockResponse = new Response(JSON.stringify({ message: 'Failed' }), {
      status: 400,
    });
    const mockApiCall = jest.spyOn(
      require('./../../../../utils/http/api-call'),
      'default'
    );
    mockApiCall.mockReturnValue(Promise.resolve(mockResponse));

    RegisterAccount = require('./../register-account').default;
    render(
      <Web3Context.Provider value={testContextValue}>
        <RegisterAccount />
      </Web3Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    });

    const nameField = screen.getByPlaceholderText('Name');
    userEvent.type(nameField, 'test');
    const addressField = screen.getByPlaceholderText('Address');
    userEvent.type(addressField, 'test');

    let btn: any;
    await waitFor(() => {
      btn = screen.getByRole('button', { name: 'Add' });
      expect(btn).toBeInTheDocument();
      expect(btn).not.toHaveAttribute('disabled');
    });

    userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText('Failed'));
    });
  });

  it('should display a success message if backend returns a success response', async () => {
    const mockResponse = new Response(JSON.stringify({ data: {} }), {
      status: 201,
    });
    const mockApiCall = jest.spyOn(
      require('./../../../../utils/http/api-call'),
      'default'
    );
    mockApiCall.mockReturnValue(Promise.resolve(mockResponse));

    RegisterAccount = require('./../register-account').default;
    render(
      <Web3Context.Provider value={testContextValue}>
        <RegisterAccount />
      </Web3Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    });

    const nameField = screen.getByPlaceholderText('Name');
    userEvent.type(nameField, 'test');
    const addressField = screen.getByPlaceholderText('Address');
    userEvent.type(addressField, 'test');

    let btn: any;
    await waitFor(() => {
      btn = screen.getByRole('button', { name: 'Add' });
      expect(btn).toBeInTheDocument();
      expect(btn).not.toHaveAttribute('disabled');
    });

    userEvent.click(btn);

    await waitFor(() => {
      expect(
        screen.getByText(
          'Account successfully added! Go to the LIST tab to view accounts.'
        )
      );
    });
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Tests for adding ETH accounts to a user
 */
describe('AccountCreate', () => {
  let mockGetWeb3: any, mockApiCall: any, mockGetSession: any;
  beforeEach(() => {
    const web3Utils = require('@/utils/web3/web3');
    mockGetWeb3 = jest.spyOn(web3Utils, 'default');

    const apiCallUtil = require('@/utils/http/api-call');
    mockApiCall = jest.spyOn(apiCallUtil, 'default');

    const getSessionUtil = require('@/actions/auth/session');
    mockGetSession = jest.spyOn(getSessionUtil, 'getSession');
  });

  it('should display the form for adding a new ETH account', async () => {
    const AccountCreate = require('./page').default;

    render(<AccountCreate />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Address')).toBeInTheDocument();
      const addBtn = screen.getByRole('button', { name: 'Add' });
      expect(addBtn).toBeInTheDocument();
    });
  });

  it('should ensure that the account name is a required field', async () => {
    const AccountCreate = require('./page').default;

    render(<AccountCreate />);

    let nameField: any, addressField: any, addBtn: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Name');
      expect(nameField).toBeInTheDocument();
      addressField = screen.getByPlaceholderText('Address');
      addBtn = screen.getByRole('button', { name: 'Add' });
    });

    await userEvent.click(nameField);
    await userEvent.click(addressField);
    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(addBtn).toBeDisabled();
    });
  });

  it('should ensure that the account address is a required field', async () => {
    const AccountCreate = require('./page').default;

    render(<AccountCreate />);

    let nameField: any, addressField: any, addBtn: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Name');
      expect(nameField).toBeInTheDocument();
      addressField = screen.getByPlaceholderText('Address');
      addBtn = screen.getByRole('button', { name: 'Add' });
    });

    await userEvent.type(nameField, 'Account 1');
    await userEvent.click(addressField);
    await userEvent.click(nameField);
    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(addBtn).toBeDisabled();
    });
  });

  it('should ensure that Add button is enabled in form is filled', async () => {
    const AccountCreate = require('./page').default;

    render(<AccountCreate />);

    let nameField: any, addressField: any, addBtn: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Name');
      expect(nameField).toBeInTheDocument();
      addressField = screen.getByPlaceholderText('Address');
      addBtn = screen.getByRole('button', { name: 'Add' });
    });

    await userEvent.type(nameField, 'Account 1');
    await userEvent.type(addressField, 'Address123');
    await userEvent.click(nameField);
    await waitFor(() => {
      expect(addBtn).not.toBeDisabled();
    });
  });

  it('should display an error message if user does not unlock Metamask', async () => {
    mockGetWeb3.mockReturnValue(Promise.reject(null));
    const AccountCreate = require('./page').default;

    render(<AccountCreate />);

    let nameField: any, addressField: any, addBtn: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Name');
      expect(nameField).toBeInTheDocument();
      addressField = screen.getByPlaceholderText('Address');
      addBtn = screen.getByRole('button', { name: 'Add' });
    });

    await userEvent.type(nameField, 'Account 1');
    await userEvent.type(addressField, 'Address123');
    await waitFor(async () => {
      expect(addBtn).not.toBeDisabled();
      await userEvent.click(addBtn);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Metamask locked or inaccessible', { exact: false })
      ).toBeInTheDocument();
    });
  });

  it('should display an error if the account added is not present in Metamask', async () => {
    mockGetWeb3.mockReturnValue(
      Promise.resolve({
        eth: {
          getAccounts: jest.fn().mockReturnValue(['Address456']),
        },
      })
    );
    const AccountCreate = require('./page').default;

    render(<AccountCreate />);

    let nameField: any, addressField: any, addBtn: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Name');
      expect(nameField).toBeInTheDocument();
      addressField = screen.getByPlaceholderText('Address');
      addBtn = screen.getByRole('button', { name: 'Add' });
    });

    await userEvent.type(nameField, 'Account 1');
    await userEvent.type(addressField, 'Address123');
    await waitFor(async () => {
      expect(addBtn).not.toBeDisabled();
      await userEvent.click(addBtn);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Account is not linked in Metamask', { exact: false })
      ).toBeInTheDocument();
    });
  });

  it('should display an error if the API responds with an error', async () => {
    mockApiCall.mockReturnValue(
      Promise.resolve({ json: () => ({ message: 'Some error' }) })
    );
    mockGetSession.mockReturnValue(Promise.resolve('token123'));
    mockGetWeb3.mockReturnValue(
      Promise.resolve({
        eth: {
          getAccounts: jest.fn().mockReturnValue(['Address123']),
        },
      })
    );
    const AccountCreate = require('./page').default;

    render(<AccountCreate />);

    let nameField: any, addressField: any, addBtn: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Name');
      expect(nameField).toBeInTheDocument();
      addressField = screen.getByPlaceholderText('Address');
      addBtn = screen.getByRole('button', { name: 'Add' });
    });

    await userEvent.type(nameField, 'Account 1');
    await userEvent.type(addressField, 'Address123');
    await waitFor(async () => {
      expect(addBtn).not.toBeDisabled();
      await userEvent.click(addBtn);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Some error', { exact: false })
      ).toBeInTheDocument();
    });
  });

  it('should display a success message if the account could be added', async () => {
    mockApiCall.mockReturnValue(
      Promise.resolve({ json: () => ({ data: null }) })
    );
    mockGetSession.mockReturnValue(Promise.resolve('token123'));
    mockGetWeb3.mockReturnValue(
      Promise.resolve({
        eth: {
          getAccounts: jest.fn().mockReturnValue(['Address123']),
        },
      })
    );
    const AccountCreate = require('./page').default;

    render(<AccountCreate />);

    let nameField: any, addressField: any, addBtn: any;
    await waitFor(() => {
      nameField = screen.getByPlaceholderText('Name');
      expect(nameField).toBeInTheDocument();
      addressField = screen.getByPlaceholderText('Address');
      addBtn = screen.getByRole('button', { name: 'Add' });
    });

    await userEvent.type(nameField, 'Account 1');
    await userEvent.type(addressField, 'Address123');
    await waitFor(async () => {
      expect(addBtn).not.toBeDisabled();
      await userEvent.click(addBtn);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Account successfully added', { exact: false })
      ).toBeInTheDocument();
    });
  });
});

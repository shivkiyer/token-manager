import { render, screen, waitFor } from '@testing-library/react';

/**
 * Tests for the accounts list page
 */
describe('AccountList', () => {
  let mockAccountsListLoader: any;
  beforeEach(() => {
    const accountUtils = require('@/actions/account/accountListLoader');
    mockAccountsListLoader = jest.spyOn(accountUtils, 'default');
  });

  it('should display a no accounts found message if user has no linked accounts', async () => {
    mockAccountsListLoader.mockReturnValue(Promise.resolve({ data: [] }));
    const AccountList = require('./page').default;

    render(await AccountList());

    await waitFor(() => {
      expect(
        screen.getByText('No accounts found', { exact: false })
      ).toBeInTheDocument();
    });
  });

  it('should display an error if backend returns an error message while fetching accounts', async () => {
    mockAccountsListLoader.mockReturnValue(
      Promise.resolve({ message: 'Some error' })
    );
    const AccountList = require('./page').default;

    render(await AccountList());

    await waitFor(() => {
      expect(
        screen.getByText('Some error', { exact: false })
      ).toBeInTheDocument();
    });
  });

  it('should display account cards for the accounts linked with user', async () => {
    const mockAccountData = [
      {
        accountId: 1,
        accountName: 'Acc 1',
        accountAddress: 'Addr 1',
      },
      {
        accountId: 2,
        accountName: 'Acc 2',
        accountAddress: 'Addr 2',
      },
      {
        accountId: 3,
        accountName: 'Acc 3',
        accountAddress: 'Addr 3',
      },
    ];
    mockAccountsListLoader.mockReturnValue(
      Promise.resolve({ data: mockAccountData })
    );
    const AccountList = require('./page').default;

    render(await AccountList());

    await waitFor(() => {
      expect(screen.getByText('Acc 1', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Acc 2', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Acc 3', { exact: false })).toBeInTheDocument();
    });
  });
});

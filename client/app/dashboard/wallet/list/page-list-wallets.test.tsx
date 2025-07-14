import { render, screen, waitFor } from '@testing-library/react';

describe('ListWallets', () => {
  let mockFetchWallets: any;
  let mockWalletData: any;

  beforeEach(() => {
    mockWalletData = [
      {
        id: 1,
        name: 'Wallet 1',
        description: 'Wallet 1 description',
        address: 'wallet1address123',
        maxLimit: 2.5,
        isOwner: true,
      },
      {
        id: 2,
        name: 'Wallet 2',
        description: 'Wallet 2 description',
        address: 'wallet2address456',
        maxLimit: 5,
        isOwner: false,
      },
      {
        id: 3,
        name: 'Wallet 3',
        description: 'Wallet 3 description',
        address: 'wallet3address789',
        maxLimit: 7.5,
        isOwner: true,
      },
    ];
    const fetchWalletsUtil = require('@/actions/wallet/fetchWallets');
    mockFetchWallets = jest.spyOn(fetchWalletsUtil, 'default');
    mockFetchWallets.mockReturnValue(Promise.resolve({ data: [] }));
  });

  it('should display a no wallets found message if backend finds no wallets associated with user', async () => {
    const ListWallets = require('./page').default;

    render(await ListWallets());
    await waitFor(() => {
      expect(screen.getByText('No wallets found', { exact: false }));
    });
  });

  it('should display wallet cards for wallet data returned by API', async () => {
    mockFetchWallets.mockReturnValue(Promise.resolve({ data: mockWalletData }));
    const ListWallets = require('./page').default;

    render(await ListWallets());
    await waitFor(() => {
      expect(screen.getByText('Wallet 1'));
      expect(screen.getByText('Wallet 2'));
      expect(screen.getByText('Wallet 3'));
      expect(screen.getByText('Wallet 1 description'));
      expect(screen.getByText('Wallet 2 description'));
      expect(screen.getByText('Wallet 3 description'));
      expect(screen.getByText('2.5'));
      expect(screen.getByText('5'));
      expect(screen.getByText('7.5'));
      const manageBtns = screen.getAllByRole('button', { name: 'Manage' });
      expect(manageBtns.length).toBe(2);
      const accessBtns = screen.getAllByRole('button', { name: 'Access' });
      expect(accessBtns.length).toBe(1);
    });
  });

  it('should display error message if backend returns an error', async () => {
    mockFetchWallets.mockReturnValue(
      Promise.resolve({ message: 'Some error' })
    );
    const ListWallets = require('./page').default;

    render(await ListWallets());
    await waitFor(() => {
      expect(screen.getByText('Some error', { exact: false }));
    });
  });
});

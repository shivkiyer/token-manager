require('dotenv').config();

const Account = require('./../../../db/models/account');
const Wallet = require('./../../../db/models/wallet');
const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const areAccountUsersInWallet = require('./../areAccountUsersInWallet');

describe('areAccountUsersInWallet', () => {
  let sequelize;
  let testWalletOwner;
  let testWallet;
  let testAccounts;

  beforeAll(async () => {
    try {
      jest.resetModules();
      sequelize = await setupTestDb();
    } catch (e) {
      console.log('Database setup error');
      console.log(e);
      process.exit(1);
    }
  });

  beforeEach(async () => {
    try {
      await sequelize.authenticate();
      await Account.destroy({ truncate: { cascade: true } });
      await Wallet.destroy({ truncate: { cascade: true } });

      testWalletOwner = await Account.create({
        name: 'Acc 1',
        address: 'Acc addr1',
      });
      testWallet = await testWalletOwner.createWallet({
        name: 'Wallet 1',
        description: 'Wallet descr 1',
        address: 'Walltet addr1',
        maxLimit: 0.1,
      });

      testAccounts = await Account.bulkCreate([
        {
          name: 'Acc 2',
          address: 'Acc addr2',
        },
        {
          name: 'Acc 3',
          address: 'Acc addr3',
        },
        {
          name: 'Acc 4',
          address: 'Acc addr4',
        },
        {
          name: 'Acc 5',
          address: 'Acc addr5',
        },
      ]);

      await testWallet.addUser([testAccounts[1], testAccounts[3]]);
    } catch (e) {
      console.log('Database error');
      console.log(e);
      process.exit(1);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should return true if all accounts passed are in the wallet', async () => {
    const result = await areAccountUsersInWallet(
      [testAccounts[1], testAccounts[3]],
      testWallet
    );
    expect(result).toBe(true);
  });

  it('should return true if one account passed is in the wallet', async () => {
    let result;
    result = await areAccountUsersInWallet([testAccounts[1]], testWallet);
    expect(result).toBe(true);

    result = await areAccountUsersInWallet([testAccounts[3]], testWallet);
    expect(result).toBe(true);
  });

  it('should return true if one account passed is in the wallet along with accounts that are not', async () => {
    let result;
    result = await areAccountUsersInWallet(
      [testAccounts[1], testAccounts[2]],
      testWallet
    );
    expect(result).toBe(true);

    result = await areAccountUsersInWallet(
      [testAccounts[3], testAccounts[0]],
      testWallet
    );
    expect(result).toBe(true);

    result = await areAccountUsersInWallet(
      [testAccounts[3], testAccounts[0], testAccounts[2]],
      testWallet
    );
    expect(result).toBe(true);
  });

  it('should return false only if none of the accounts are in the wallet', async () => {
    let result;
    result = await areAccountUsersInWallet(
      [testAccounts[2]],
      testWallet
    );
    expect(result).toBe(false);

    result = await areAccountUsersInWallet(
      [testAccounts[2], testAccounts[0]],
      testWallet
    );
    expect(result).toBe(false);
  });
});

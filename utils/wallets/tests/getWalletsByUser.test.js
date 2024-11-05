require('dotenv').config();

const User = require('./../../../db/models/user');
const Account = require('./../../../db/models/account');
const Wallet = require('./../../../db/models/wallet');
const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const createTestUser = require('./../../../test-utils/db/createTestUser');
const getWalletsByUser = require('./../getWalletsByUser');

describe('getWalletsByUser', () => {
  let sequelize;
  let testUser, testAccounts, testWallets;

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
      await User.destroy({ truncate: { cascade: true } });
      await Account.destroy({ truncate: { cascade: true } });
      await Wallet.destroy({ truncate: { cascade: true } });

      testUser = await createTestUser({
        username: 'abc1@gmail.com',
        password: 'xyz',
      });

      testAccounts = [];
      const account1 = await testUser.createAccount({
        name: 'Acc 1',
        address: 'accaddr1',
      });
      testAccounts.push(account1);
      const account2 = await testUser.createAccount({
        name: 'Acc 2',
        address: 'accaddr2',
      });
      testAccounts.push(account2);

      testWallets = [];
      const wallet1 = await testAccounts[0].createWallet({
        name: 'Wallet 1',
        description: 'Wallet descr 1',
        address: 'walladdr1',
        maxLimit: 2,
      });
      testWallets.push(wallet1);
      const wallet2 = await testAccounts[0].createWallet({
        name: 'Wallet 2',
        description: 'Wallet descr 2',
        address: 'walladdr2',
        maxLimit: 3,
      });
      testWallets.push(wallet2);

      const wallet3 = await testAccounts[1].createWallet({
        name: 'Wallet 3',
        description: 'Wallet descr 3',
        address: 'walladdr3',
        maxLimit: 4,
      });
      testWallets.push(wallet3);

      const wallet4 = await testAccounts[1].createWallet({
        name: 'Wallet 4',
        description: 'Wallet descr 4',
        address: 'walladdr4',
        maxLimit: 5,
      });
      testWallets.push(wallet4);
    } catch (e) {
      console.log('Database setup error');
      console.log(e);
      process.exit(1);
    }
  });

  afterAll(async () => {
    try {
      await sequelize.close();
    } catch (e) {
      console.log('Database teardown error');
      console.log(e);
      process.exit(1);
    }
  });

  it('should return wallets created by user even if owner accounts are different', async () => {
    const result = await getWalletsByUser({ user: testUser });
    expect(result.length).toBe(4);
  });

  it('should return and empty array if no wallets are owned by user', async () => {
    const newUser = await createTestUser({
      username: 'abc2@gmail.com',
      password: 'xyz',
    });
    const result = await getWalletsByUser({ user: newUser });
    expect(result.length).toBe(0);
  });
});

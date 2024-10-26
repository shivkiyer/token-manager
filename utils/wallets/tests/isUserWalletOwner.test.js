require('dotenv').config();

const User = require('./../../../db/models/user');
const Account = require('./../../../db/models/account');
const Wallet = require('./../../../db/models/wallet');
const createTestUser = require('./../../../test-utils/db/createTestUser');
const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const isUserWalletOwner = require('./../isUserWalletOwner');

describe('isUserWalletOwner', () => {
  let sequelize;
  let testUsers, testAccounts, testWallets;

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
      await Wallet.destroy({ truncate: { cascade: true } });
      await Account.destroy({ truncate: { cascade: true } });
      await User.destroy({ truncate: { cascade: true } });

      const tUser1 = await createTestUser({
        username: 'abc1@gmail.com',
        password: 'xyz',
      });
      const tUser2 = await createTestUser({
        username: 'abc2@gmail.com',
        password: 'xyz',
      });
      testUsers = [tUser1, tUser2];

      testAccounts = [];
      const acc1 = await testUsers[0].createAccount({
        name: 'Acc 1',
        address: 'Acc adrr1',
      });
      testAccounts.push(acc1);
      const acc2 = await testUsers[1].createAccount({
        name: 'Acc 2',
        address: 'Acc adrr2',
      });
      testAccounts.push(acc2);
      const acc3 = await testUsers[0].createAccount({
        name: 'Acc 3',
        address: 'Acc adrr3',
      });
      testAccounts.push(acc3);
      const acc4 = await testUsers[1].createAccount({
        name: 'Acc 4',
        address: 'Acc adrr4',
      });
      testAccounts.push(acc4);

      testWallets = [];
      const wall1 = await testAccounts[0].createWallet({
        name: 'Wall 1',
        description: 'Descr 1',
        address: 'Wall addr1',
        maxLimit: 0.5,
      });
      testWallets.push(wall1);

      const wall2 = await testAccounts[1].createWallet({
        name: 'Wall 2',
        description: 'Descr 2',
        address: 'Wall addr2',
        maxLimit: 0.75,
      });
      testWallets.push(wall2);

      const wall3 = await testAccounts[2].createWallet({
        name: 'Wall 3',
        description: 'Descr 3',
        address: 'Wall addr3',
        maxLimit: 1,
      });
      testWallets.push(wall3);

      const wall4 = await testAccounts[3].createWallet({
        name: 'Wall 4',
        description: 'Descr 4',
        address: 'Wall addr4',
        maxLimit: 1.5,
      });
      testWallets.push(wall4);
    } catch (e) {
      console.log('Database error');
      console.log(e);
      process.exit(1);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should correctly identify the users through owner accounts', async () => {
    const result1 = await isUserWalletOwner('abc1@gmail.com', testWallets[0]);
    expect(result1).toBe(true);
    const result2 = await isUserWalletOwner('abc2@gmail.com', testWallets[1]);
    expect(result2).toBe(true);
    const result3 = await isUserWalletOwner('abc1@gmail.com', testWallets[2]);
    expect(result3).toBe(true);
    const result4 = await isUserWalletOwner('abc2@gmail.com', testWallets[3]);
    expect(result4).toBe(true);
  });

  it('should correctly identify genuine users as now owners of wallets', async () => {
    const result1 = await isUserWalletOwner('abc2@gmail.com', testWallets[0]);
    expect(result1).toBe(false);
    const result2 = await isUserWalletOwner('abc1@gmail.com', testWallets[1]);
    expect(result2).toBe(false);
  });

  it('should reject unknown user as not owner of wallet', async () => {
    const result1 = await isUserWalletOwner('abc3@gmail.com', testWallets[0]);
    expect(result1).toBe(false);
  });
});

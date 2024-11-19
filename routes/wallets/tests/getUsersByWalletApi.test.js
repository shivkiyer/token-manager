require('dotenv').config();
const request = require('supertest');

const User = require('./../../../db/models/user');
const Account = require('./../../../db/models/account');
const Wallet = require('./../../../db/models/wallet');
const WalletUser = require('./../../../db/models/walletUser')
const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const server = require('./../../../server/server');
const createTestUser = require('./../../../test-utils/db/createTestUser')
const createTestJwt = require('./../../../test-utils/auth/createTestJwt');

describe('Get users for a wallet', () => {
  let sequelize;
  let testUsers, testAccounts, testWallet;

  beforeAll(async () => {
    try {
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

      testUsers = [];
      for (let i = 0; i < 2; i++) {
        const tUser = await createTestUser({
          username: `abc${i + 1}@gmail.com`,
          password: 'xyz',
        });
        testUsers.push(tUser);
      }

      testAccounts = [];
      const testAccount1 = await testUsers[0].createAccount({
        name: 'Acc 1',
        address: 'Acc addr 1',
      });
      testAccounts.push(testAccount1);

      const testAccount2 = await testUsers[1].createAccount({
        name: 'Acc 2',
        address: 'Acc addr 2',
      });
      testAccounts.push(testAccount2);

      const testAccount3 = await testUsers[1].createAccount({
        name: 'Acc 3',
        address: 'Acc addr 3',
      });
      testAccounts.push(testAccount3);


      testWallet = await testAccounts[0].createWallet({
        name: 'Wallet 1',
        description: 'Wallet descr 1',
        address: 'Walletaddr1',
        maxLimit: 0.1,
      });

      await WalletUser.create({AccountId: testAccounts[1].id, WalletId: testWallet.id})
      await WalletUser.create({AccountId: testAccounts[2].id, WalletId: testWallet.id})
    } catch (e) {
      console.log('Database initialization error');
      console.log(e);
      process.exit(1);
    }
  });

  afterAll(async () => {
    try {
      await server.close();
      await sequelize.close();
    } catch (e) {
      console.log('Database close error');
      console.log(e);
      process.exit(1);
    }
  });

  it('should return the accounts and users associated with wallet', async () => {
    const testJwt = await createTestJwt(testUsers[0].username);

    const response = await request(server)
      .get(`/api/wallets/${testWallet.address}/get-users`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);
    
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
    const accountNames = response.body.data.map(item => item.name);
    expect(accountNames).toContain(testAccounts[1].name)
    expect(accountNames).toContain(testAccounts[2].name)
    expect(response.body.data[0].User).not.toBe(null);
  })

  it('should return a 403 if no credentials are passed', async () => {
    const response = await request(server)
      .get(`/api/wallets/${testWallet.address}/get-users`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(403);
  })
})
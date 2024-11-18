require('dotenv').config();
const request = require('supertest');

const User = require('./../../../db/models/user');
const Account = require('./../../../db/models/account');
const Wallet = require('./../../../db/models/wallet');
const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const server = require('./../../../server/server');
const createTestUser = require('./../../../test-utils/db/createTestUser')
const createTestJwt = require('./../../../test-utils/auth/createTestJwt');

describe('Retrieve wallets by user API', () => {
  let sequelize;
  let testUsers, testAccounts, testWallets;

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
      const tAccounts1 = await testUsers[0].createAccount({
        name: 'Acc 1',
        address: 'Acc addr 1',
      });
      testAccounts.push(tAccounts1);
      const tAccounts2 = await testUsers[0].createAccount({
        name: 'Acc 2',
        address: 'Acc addr 2',
      });
      testAccounts.push(tAccounts2);

      const tAccounts3 = await testUsers[1].createAccount({
        name: 'Acc 3',
        address: 'Acc addr 3',
      });
      testAccounts.push(tAccounts3);
      const tAccounts4 = await testUsers[1].createAccount({
        name: 'Acc 4',
        address: 'Acc addr 4',
      });
      testAccounts.push(tAccounts4);

      testWallets = [];
      const testWallet1 = await testAccounts[0].createWallet({
        name: 'Wallet 1',
        description: 'Wallet descr 1',
        address: 'Walletaddr1',
        maxLimit: 0.1,
      });
      testWallets.push(testWallet1);

      const testWallet2 = await testAccounts[1].createWallet({
        name: 'Wallet 2',
        description: 'Wallet descr 2',
        address: 'Walletaddr2',
        maxLimit: 0.5,
      });
      testWallets.push(testWallet2);
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

  it('should return all wallets associated with a user through multiple accounts', async () => {
    const testJwt = await createTestJwt(testUsers[0].username);

    const response = await request(server)
      .get('/api/wallets/')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].isOwner).toBe(true);
    expect(response.body.data[1].isOwner).toBe(true);
    expect(response.body.data[0].owner).not.toBe(null);
    expect(response.body.data[1].owner).not.toBe(null);
  });

  it('should return a 403 if user credentials are missing', async () => {
    const response = await request(server)
      .get('/api/wallets/')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(403);
  });

  it('should return an empty array if no wallets have been created by user', async () => {
    const testJwt = await createTestJwt(testUsers[1].username);

    const response = await request(server)
      .get('/api/wallets/')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
  });
});

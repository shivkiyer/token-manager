require('dotenv').config();
const request = require('supertest');

const User = require('./../../../db/models/user');
const Account = require('./../../../db/models/account');
const Wallet = require('./../../../db/models/wallet');
const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const createTestUser = require('./../../../test-utils/db/createTestUser');
const createTestJwt = require('./../../../test-utils/auth/createTestJwt');
const server = require('./../../../server/server');

describe('verifyWallet API', () => {
  let sequelize;
  let testUser, testAccounts, testWallets;

  beforeAll(async () => {
    try {
      jest.resetModules();
      sequelize = await setupTestDb();
    } catch (e) {
      console.log('Test setup error');
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

      const wallet2 = await testAccounts[1].createWallet({
        name: 'Wallet 2',
        description: 'Wallet descr 2',
        address: 'walladdr2',
        maxLimit: 3,
      });
      testWallets.push(wallet2);
    } catch (e) {
      console.log('Test initialization error');
      console.log(e);
      process.exit(1);
    }
  });

  afterAll(async () => {
    try {
      await sequelize.close();
      await server.close();
    } catch (e) {
      console.log('Test teardown error');
      console.log(e);
      process.exit(1);
    }
  });

  it('should return a 200 if wallet can be created', async () => {
    const testJwt = await createTestJwt('abc1@gmail.com');
    const response = await request(server)
      .post('/api/wallets/verify-wallet')
      .send({ name: 'Other wallet name', owner: testAccounts[0].address })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);
    expect(response.status).toBe(200);
  });

  it('should return a 400 if a wallet with the same name exists with the user as owner', async () => {
    const testJwt = await createTestJwt('abc1@gmail.com');
    const response = await request(server)
      .post('/api/wallets/verify-wallet')
      .send({ name: 'Wallet 1', owner: testAccounts[1].address })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Wallet with the same name exists');
  });

  it('should return an error if the user is not the owner of the account', async () => {
    await createTestUser({
      username: 'abc2@gmail.com',
      password: 'xyz',
    });
    const testJwt = await createTestJwt('abc2@gmail.com');
    const response = await request(server)
      .post('/api/wallets/verify-wallet')
      .send({ name: 'Other wallet', owner: testAccounts[0].address })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Only the account owner can use the account to create a wallet'
    );
  });

  it('should return a 403 if no user credentials are passed', async () => {
    const response = await request(server)
      .post('/api/wallets/verify-wallet')
      .send({ name: 'Other wallet', owner: testAccounts[0].address })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Login required for this action.');
  });
});

require('dotenv').config();
const request = require('supertest');

const User = require('./../../../db/models/user');
const Account = require('./../../../db/models/account');
const Wallet = require('./../../../db/models/wallet');
const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const server = require('./../../../server/server');
const createTestUser = require('./../../../test-utils/db/createTestUser');
const createTestJwt = require('./../../../test-utils/auth/createTestJwt');

describe('Retrieve Wallet Details', () => {
  let sequelize;
  let testUser, testAccount, testWallet;

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

      testUser = await createTestUser({
        username: 'abc1@gmail.com',
        password: 'xyz',
      });

      testAccount = await testUser.createAccount({
        name: 'Acc 1',
        address: 'Acc addr 1',
      });

      testWallet = await testAccount.createWallet({
        name: 'Wallet 1',
        description: 'Wallet descr 1',
        address: 'Walletaddr1',
        maxLimit: 0.1,
      });
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

  it('should return the correct wallet with respect to id', async () => {
    const testJwt = await createTestJwt(testUser.username);

    const response = await request(server)
      .get(`/api/wallets/${testWallet.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    expect(response.body.data.address).toBe(testWallet.address);
    expect(response.body.data.ownerId).toBe(testAccount.id);
    expect(response.body.data.isOwner).toBe(true);
  });

  it('should return a 400 if the id is incorrect', async () => {
    const testJwt = await createTestJwt(testUser.username);

    const response = await request(server)
      .get(`/api/wallets/${testWallet.id + 1}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Wallet could not be found');
  });

  it('should return a 403 if credentials are missing or incorrect', async () => {
    const response = await request(server)
      .get(`/api/wallets/${testWallet.id + 1}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(403);
  });
});

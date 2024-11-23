require('dotenv').config();
const request = require('supertest');

const User = require('./../../../db/models/user');
const Account = require('./../../../db/models/account');
const Wallet = require('./../../../db/models/wallet');
const WalletUser = require('./../../../db/models/walletUser');
const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const server = require('./../../../server/server');
const createTestUser = require('./../../../test-utils/db/createTestUser');
const createTestJwt = require('./../../../test-utils/auth/createTestJwt');

describe('Search users for wallet endpoint', () => {
  let sequelize;
  let testUsers, testAccounts;

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
      await WalletUser.destroy({ truncate: { cascade: true } });

      testUsers = [];
      const testUser1 = await createTestUser({
        username: 'abc1@gmail.com',
        password: 'xyz',
        name: 'Some User 1',
      });
      testUsers.push(testUser1);

      const testUser2 = await createTestUser({
        username: 'abc2@gmail.com',
        password: 'xyz',
        name: 'Some User 2',
      });
      testUsers.push(testUser2);

      testAccounts = [];
      const testAccount1 = await testUsers[0].createAccount({
        name: 'Some account 1',
        address: 'accaddr1234',
      });
      testAccounts.push(testAccount1);

      const testAccount2 = await testUsers[1].createAccount({
        name: 'Some account 2',
        address: 'accaddr5678',
      });
      testAccounts.push(testAccount2);
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

  it('should return account if search field matches account fields', async () => {
    const testJwt = await createTestJwt(testUsers[0].username);

    let response = await request(server)
      .get('/api/wallets/search-users?search=some')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);

    response = await request(server)
      .get('/api/wallets/search-users?search=account 1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].address).toBe('accaddr1234');
  });

  it('should fetch accounts if search query matches associated users', async () => {
    const testJwt = await createTestJwt(testUsers[0].username);

    let response = await request(server)
      .get('/api/wallets/search-users?search=user')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);

    response = await request(server)
      .get('/api/wallets/search-users?search=abc2')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].address).toBe('accaddr5678');
  });

  it('should exclude accounts already added to a wallet from search results', async () => {
    const testWallet = await testAccounts[0].createWallet({
      name: 'Wallet 1',
      description: 'Wallet descr 1',
      address: 'wall1addr',
      maxLimit: 2,
    });

    await WalletUser.create({
      AccountId: testAccounts[1].id,
      WalletId: testWallet.id,
    });

    const testJwt = await createTestJwt(testUsers[0].username);

    let response = await request(server)
      .get(`/api/wallets/search-users?search=user&wallet=${testWallet.address}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].address).toBe('accaddr1234');

    response = await request(server)
      .get(`/api/wallets/search-users?search=abc2&wallet=${testWallet.address}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
  });

  it('should return a 403 if credentials are not passed', async () => {
    const response = await request(server)
      .get('/api/wallets/search-users?search=user')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(403);
  });
});

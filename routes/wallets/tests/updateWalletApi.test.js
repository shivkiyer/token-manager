require('dotenv').config();
const request = require('supertest');

const User = require('./../../../db/models/user');
const Account = require('./../../../db/models/account');
const Wallet = require('./../../../db/models/wallet');
const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const createTestUser = require('./../../../test-utils/db/createTestUser');
const createTestJwt = require('./../../../test-utils/auth/createTestJwt');
const server = require('./../../../server/server');

describe('Update wallet API', () => {
  let sequelize;
  let testUsers, testAccounts, testWallet;

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

    const tAccounts2 = await testUsers[1].createAccount({
      name: 'Acc 2',
      address: 'Acc addr 2',
    });
    testAccounts.push(tAccounts2);

    testWallet = await testAccounts[0].createWallet({
      name: 'Wallet 1',
      description: 'Wallet descr 1',
      address: 'Walletaddr1',
      maxLimit: 0.1,
    });
  });

  afterAll(async () => {
    try {
      await sequelize.close();
      await server.close();
    } catch (e) {
      console.log('Test cleanup error');
      console.log(e);
    }
  });

  it('should update wallet details with new values with correct credentials', async () => {
    const testJwt = await createTestJwt(testUsers[0].username);

    const response = await request(server)
      .patch(`/api/wallets/${testWallet.address}`)
      .send({
        name: 'New Wallet 1',
        description: 'New Wallet descr 1',
        maxLimit: 0.5,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('New Wallet 1');
    expect(response.body.data.description).toBe('New Wallet descr 1');
    expect(response.body.data.maxLimit).toBe(0.5);

    const checkWallets = await Wallet.findAll({});
    expect(checkWallets.length).toBe(1);
    expect(checkWallets[0].name).toBe('New Wallet 1');
    expect(checkWallets[0].description).toBe('New Wallet descr 1');
    expect(checkWallets[0].maxLimit).toBe(0.5);
  });

  it('should return an error if new name is duplicate of another wallet by same user', async () => {
    await testAccounts[0].createWallet({
      name: 'New Wallet 1',
      description: 'Wallet descr 1',
      address: 'Walletaddr2',
      maxLimit: 0.1,
    });

    const testJwt = await createTestJwt(testUsers[0].username);

    const response = await request(server)
      .patch(`/api/wallets/${testWallet.address}`)
      .send({
        name: 'New Wallet 1',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Another wallet with this name exists');
  });

  it('should update wallet details if no duplicate name exists with same user', async () => {
    await testAccounts[1].createWallet({
      name: 'New Wallet 1',
      description: 'Wallet descr 1',
      address: 'Walletaddr2',
      maxLimit: 0.1,
    });

    const testJwt = await createTestJwt(testUsers[0].username);

    const response = await request(server)
      .patch(`/api/wallets/${testWallet.address}`)
      .send({
        name: 'New Wallet 1',
        description: 'New Wallet descr 1',
        maxLimit: 0.5,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('New Wallet 1');
  });

  it('should return an error if requesting user is not wallet owner', async () => {
    const testJwt = await createTestJwt(testUsers[1].username);

    const response = await request(server)
      .patch(`/api/wallets/${testWallet.address}`)
      .send({
        name: 'New Wallet 1',
        description: 'New Wallet descr 1',
        maxLimit: 0.5,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Only wallet owner can change wallet details'
    );
  });
});

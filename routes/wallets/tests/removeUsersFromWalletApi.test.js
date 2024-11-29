require('dotenv').config();
const request = require('supertest');

const User = require('./../../../db/models/user');
const Account = require('./../../../db/models/account');
const Wallet = require('./../../../db/models/wallet');
const WalletUser = require('./../../../db/models/walletUser');
const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const createTestUser = require('./../../../test-utils/db/createTestUser');
const createTestJwt = require('./../../../test-utils/auth/createTestJwt');
const server = require('./../../../server/server');

describe('Remove wallet users API', () => {
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

    testWallet = await testAccounts[0].createWallet({
      name: 'Wallet 1',
      description: 'Wallet descr 1',
      address: 'Walletaddr1',
      maxLimit: 0.1,
    });

    await testWallet.addUser(testAccounts[1]);
    await testWallet.addUser(testAccounts[2]);
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

  it('should remove specified accounts from wallet', async () => {
    const testJwt = await createTestJwt(testUsers[0].username);

    const response = await request(server)
      .post(`/api/wallets/${testWallet.address}/remove-user`)
      .send({
        accounts: [testAccounts[1].address, testAccounts[2].address],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    const checkWalletUsers = await WalletUser.findAll({});
    expect(checkWalletUsers.length).toBe(0);
  });

  it('should return an error if none of the accounts are users of the wallet', async () => {
    const testJwt = await createTestJwt(testUsers[0].username);

    const response = await request(server)
      .post(`/api/wallets/${testWallet.address}/remove-user`)
      .send({
        accounts: [testAccounts[3].address],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'None of the accounts are users of the wallet'
    );
  });

  it('should remove accounts from wallet if some are not users of the wallet', async () => {
    const testJwt = await createTestJwt(testUsers[0].username);

    const response = await request(server)
      .post(`/api/wallets/${testWallet.address}/remove-user`)
      .send({
        accounts: [testAccounts[1].address, testAccounts[3].address],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    const checkWalletUsers = await WalletUser.findAll({});
    expect(checkWalletUsers.length).toBe(1);
  });

  it('should return an error if requesting user is not wallet owner', async () => {
    const testJwt = await createTestJwt(testUsers[1].username);

    const response = await request(server)
      .post(`/api/wallets/${testWallet.address}/remove-user`)
      .send({
        accounts: [testAccounts[1].address, testAccounts[2].address],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Only wallet owner can remove users');
  });

  it('should return a 403 if credentials are missing', async () => {
    const response = await request(server)
      .post(`/api/wallets/${testWallet.address}/remove-user`)
      .send({
        accounts: [testAccounts[1].address, testAccounts[2].address],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(403);
  });

  it('should return a 400 if the body is empty', async () => {
    const testJwt = await createTestJwt(testUsers[0].username);

    const response = await request(server)
      .post(`/api/wallets/${testWallet.address}/remove-user`)
      .send({})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Account addresses missing');
  });
});

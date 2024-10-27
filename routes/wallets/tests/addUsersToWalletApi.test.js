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

describe('add Account Users to Wallet API', () => {
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

  it('should add users to wallet with no users', async () => {
    const testJwt = await createTestJwt(testUsers[0].username);

    const response = await request(server)
      .post(`/api/wallets/${testWallet.address}/add-user`)
      .send({
        accounts: [
          testAccounts[1].address,
          testAccounts[2].address,
          testAccounts[3].address,
        ],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);

    const checkAccountUsers = await WalletUser.findAll({});
    expect(checkAccountUsers.length).toBe(3);

    const checkAccountUserAddresses = checkAccountUsers.map(
      (item) => item.AccountId
    );
    expect(checkAccountUserAddresses).toContain(testAccounts[1].id);
    expect(checkAccountUserAddresses).toContain(testAccounts[2].id);
    expect(checkAccountUserAddresses).toContain(testAccounts[3].id);
  });

  it('should return a 403 if no JWT credentials are passed', async () => {
    const response = await request(server)
      .post(`/api/wallets/${testWallet.address}/add-user`)
      .send({
        accounts: [testAccounts[1].address],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(403);
  });

  it('should return a 400 if one of the users is already added to wallet', async () => {
    const testJwt = await createTestJwt(testUsers[0].username);

    await testWallet.addUser(testAccounts[3]);

    const response = await request(server)
      .post(`/api/wallets/${testWallet.address}/add-user`)
      .send({
        accounts: [
          testAccounts[1].address,
          testAccounts[2].address,
          testAccounts[3].address,
        ],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'One or more accounts already added to wallet'
    );
  });

  it('should return a 400 user adding accounts is not owner of the wallet', async () => {
    const testJwt = await createTestJwt(testUsers[1].username);

    const response = await request(server)
      .post(`/api/wallets/${testWallet.address}/add-user`)
      .send({
        accounts: [testAccounts[3].address],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Only wallet owner can add users');
  });

  it('should add new users to wallet with users', async () => {
    const testJwt = await createTestJwt(testUsers[0].username);

    await testWallet.addUser(testAccounts[3]);

    const response = await request(server)
      .post(`/api/wallets/${testWallet.address}/add-user`)
      .send({
        accounts: [testAccounts[1].address, testAccounts[2].address],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
  });
});

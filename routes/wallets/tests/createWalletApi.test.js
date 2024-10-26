require('dotenv').config();
const request = require('supertest');

const User = require('./../../../db/models/user');
const Account = require('./../../../db/models/account');
const Wallet = require('./../../../db/models/wallet');
const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const createTestUser = require('./../../../test-utils/db/createTestUser');
const createTestJwt = require('./../../../test-utils/auth/createTestJwt');
const server = require('./../../../server/server');

describe('createWallet API', () => {
  let sequelize;
  let testUser, testAccount, testWallet;

  beforeAll(async () => {
    try {
      jest.resetModules();
      sequelize = await setupTestDb();
    } catch (e) {
      console.log(e);
    }
  });

  beforeEach(async () => {
    try {
      await sequelize.authenticate();
      await User.destroy({ truncate: { cascade: true } });
      await Account.destroy({ truncate: { cascade: true } });
      await Wallet.destroy({ truncate: { cascade: true } });

      testUser = await createTestUser({
        username: 'abc@gmail.com',
        password: 'xyz',
      });
      testAccount = await testUser.createAccount({
        name: 'Acc 1',
        address: 'Acc addr 1',
      });
    } catch (e) {
      console.log('Database error');
      console.log(e);
      process.exit(1);
    }
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

  it('should create a wallet with correct data and authentication credentials', async () => {
    const testJwt = await createTestJwt('abc@gmail.com');
    const response = await request(server)
      .post('/api/wallets/create')
      .send({
        name: 'Wallet 1',
        description: 'Wallet descr 1',
        address: 'Wallet addr1',
        maxLimit: 0.1,
        owner: testAccount.address,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe('Wallet 1');
    expect(response.body.data.description).toBe('Wallet descr 1');
    expect(response.body.data.maxLimit).toBe(0.1);

    const walletCheck = await Wallet.findOne({ where: { name: 'Wallet 1' } });
    expect(walletCheck.address).toBe('Wallet addr1');
    expect(walletCheck.ownerId).toBe(testAccount.id);
  });

  it('should return a 403 when no JWT is passed', async () => {
    const response = await request(server)
      .post('/api/wallets/create')
      .send({
        name: 'Wallet 1',
        description: 'Wallet descr 1',
        address: 'Wallet addr1',
        maxLimit: 0.1,
        owner: testAccount.address,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(403);
  });

  it('should return a 400 when incomplete data is passed', async () => {
    const testJwt = await createTestJwt('abc@gmail.com');
    let response;
    response = await request(server)
      .post('/api/wallets/create')
      .send({
        // name: 'Wallet 1',
        description: 'Wallet descr 1',
        address: 'Wallet addr1',
        maxLimit: 0.1,
        owner: testAccount.address,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('name is required');

    response = await request(server)
      .post('/api/wallets/create')
      .send({
        name: 'Wallet 1',
        description: 'Wallet descr 1',
        // address: 'Wallet addr1',
        maxLimit: 0.1,
        owner: testAccount.address,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('address is required');

    response = await request(server)
      .post('/api/wallets/create')
      .send({
        name: 'Wallet 1',
        description: 'Wallet descr 1',
        address: 'Wallet addr1',
        // maxLimit: 0.1,
        owner: testAccount.address,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('maxLimit is required');

    response = await request(server)
      .post('/api/wallets/create')
      .send({
        name: 'Wallet 1',
        description: 'Wallet descr 1',
        address: 'Wallet addr1',
        maxLimit: 0.1,
        // owner: testAccount.address,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('owner is required');
  });

  it('should not allow a single user to create multiple wallets with the same name', async () => {
    const testJwt = await createTestJwt('abc@gmail.com');
    let response;
    response = await request(server)
      .post('/api/wallets/create')
      .send({
        name: 'Wallet 1',
        description: 'Wallet descr 1',
        address: 'Wallet addr1',
        maxLimit: 0.1,
        owner: testAccount.address,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(201);

    response = await request(server)
      .post('/api/wallets/create')
      .send({
        name: 'Wallet 1',
        description: 'Wallet descr 2',
        address: 'Wallet addr2',
        maxLimit: 0.1,
        owner: testAccount.address,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Wallet with the same name exists');

    const newTestUser = await createTestUser({
      username: 'def@gmail.com',
      password: 'xyz',
    });
    const newTestAccount = await newTestUser.createAccount({
      name: 'Acc 2',
      address: 'Acc addr 2',
    });

    const newTestJwt = await createTestJwt('def@gmail.com');
    response = await request(server)
      .post('/api/wallets/create')
      .send({
        name: 'Wallet 1',
        description: 'Wallet descr 3',
        address: 'Wallet addr3',
        maxLimit: 0.1,
        owner: newTestAccount.address,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', newTestJwt);

    expect(response.status).toBe(201);

    const anotherTestAccount = await testUser.createAccount({
      name: 'Acc 3',
      address: 'Acc addr 3',
    });

    response = await request(server)
      .post('/api/wallets/create')
      .send({
        name: 'Wallet 1',
        description: 'Wallet descr 1',
        address: 'Wallet addr4',
        maxLimit: 0.1,
        owner: anotherTestAccount.address,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', newTestJwt);

    expect(response.status).toBe(400);
  });
});

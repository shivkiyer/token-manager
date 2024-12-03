const request = require('supertest');

const server = require('./../../../server/server');
const User = require('./../../../db/models/user');
const Account = require('./../../../db/models/account');

const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const createTestUser = require('./../../../test-utils/db/createTestUser');
const createTestJwt = require('./../../../test-utils/auth/createTestJwt');
const waitDelay = require('./../../../test-utils/timing/waitDelay');

describe('/api/eth-accounts/add', () => {
  let sequelize;
  let testUser;
  beforeAll(async () => {
    jest.resetModules();
    sequelize = await setupTestDb();
  });

  beforeEach(async () => {
    try {
      await sequelize.authenticate();
      await User.destroy({ truncate: { cascade: true } });
      await Account.destroy({ truncate: { cascade: true } });
      testUser = await createTestUser({
        username: 'abc@gmail.com',
        password: 'xyz',
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

  it('should create a new ETH account instance in db if correct data with credentials', async () => {
    const testJwt = await createTestJwt('abc@gmail.com');

    const response = await request(server)
      .post('/api/eth-accounts/add')
      .send({ accountName: 'testAcc', accountAddress: 'testAddr' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe('testAcc');
    expect(response.body.data.address).toBe('testAddr');

    const accounts = await Account.findAll({});
    expect(accounts.length).toBe(1);
    expect(accounts[0].name).toBe('testAcc');
    expect(accounts[0].address).toBe('testAddr');
  });

  it('should return a 403 error if JWT is not passed in header', async () => {
    const response = await request(server)
      .post('/api/eth-accounts/add')
      .send({ accountName: 'testAcc', accountAddress: 'testAddr' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Login required for this action.');
  });

  it('should return a 403 error if non-existant user makes request', async () => {
    const testJwt = await createTestJwt('abc1@gmail.com');

    const response = await request(server)
      .post('/api/eth-accounts/add')
      .send({ accountName: 'testAcc', accountAddress: 'testAddr' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(403);
  });

  it('should return a 403 on an expired JWT', async () => {
    const testJwt = await createTestJwt('abc@gmail.com', 1);

    await waitDelay(1500);

    const response = await request(server)
      .post('/api/eth-accounts/add')
      .send({ accountName: 'testAcc', accountAddress: 'testAddr' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'Authorization failed. Please login again.'
    );
  });

  it('should return an error if account address already exists in db', async () => {
    const testJwt = await createTestJwt('abc@gmail.com');

    const testAccount = await testUser.createAccount({
      name: 'testAcc',
      address: 'testAddr',
    });

    const response = await request(server)
      .post('/api/eth-accounts/add')
      .send({ accountName: 'testAcc', accountAddress: 'testAddr' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Account is already associated with a user'
    );
  });
});

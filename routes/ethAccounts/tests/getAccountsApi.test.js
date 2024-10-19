const request = require('supertest');

const server = require('./../../../server/server');
const User = require('./../../../db/models/user');
const Account = require('./../../../db/models/account');

const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const createTestUser = require('./../../../test-utils/db/createTestUser');
const createTestJwt = require('./../../../test-utils/auth/createTestJwt');

describe('/api/eth-accounts', () => {
  let sequelize;
  let testUser;

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
    try {
      await sequelize.authenticate();
      await User.destroy({ truncate: { cascade: true } });
      await Account.destroy({ truncate: { cascade: true } });

      testUser = await createTestUser({
        username: 'abc@gmail.com',
        password: 'xyz',
      });
      await testUser.createAccount({ name: 'Acc1', address: 'Addr1' });
      await testUser.createAccount({ name: 'Acc2', address: 'Addr2' });
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

  it('should return accounts associated with authenticated user', async () => {
    const testJwt = await createTestJwt('abc@gmail.com');

    const response = await request(server)
      .get('/api/eth-accounts')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].accountName).toBe('Acc1');
    expect(response.body.data[1].accountName).toBe('Acc2');
  });

  it('should return a 403 if credentials are missing', async () => {
    const response = await request(server)
      .get('/api/eth-accounts')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Login required for this action.');
  });

  it('should return a 400 is user cannot be found', async () => {
    const testJwt = await createTestJwt('abc1@gmail.com');

    const response = await request(server)
      .get('/api/eth-accounts')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', testJwt);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User not found');
  });
});

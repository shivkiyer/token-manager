const request = require('supertest');

const server = require('./../../../server/server');
const User = require('./../../../db/models/user');

const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const createTestUser = require('./../../../test-utils/db/createTestUser');

describe('/api/auth/login', () => {
  let testUser;
  let sequelize;
  beforeAll(async () => {
    jest.resetModules();
    sequelize = await setupTestDb();
  });

  beforeEach(async () => {
    try {
      await sequelize.authenticate();
      await User.destroy({ truncate: { cascade: true } });
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

  it('should login a user with valid credentials', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({ username: 'abc@gmail.com', password: 'xyz' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.data).not.toBe(null);
  });

  it('should return a 400 status if password is missing', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({ username: 'abc@gmail.com' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('password is required');
  });

  it('should return a 400 status if username is missing', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({ password: 'xyz' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('username is required');
  });

  it('should return 401 status if user is not found', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({ username: 'abc1@gmail.com', password: 'xyz' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('User not found');
  });

  it('should return 401 status if login fails', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({ username: 'abc@gmail.com', password: 'xyz1' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Login failed');
  });
});

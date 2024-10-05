const request = require('supertest');

const server = require('./../../../server/server');
const User = require('./../../../db/models/user');
const initializeModels = require('./../../../db/config/initializeModels');
const hashPassword = require('./../../../utils/auth/hashPassword');

describe('/api/auth/signup', () => {
  let sequelize;
  beforeAll(async () => {
    try {
      jest.resetModules();
      sequelize = require('./../../../db/config/config');
      await sequelize.authenticate();
      initializeModels();
    } catch (e) {
      console.log('Setting up test database failed');
      console.log(e);
      process.exit(1);
    }
  });

  beforeEach(async () => {
    try {
      await sequelize.authenticate();
      await User.destroy({ truncate: { cascade: true } });
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

  it('should create user with valid data', async () => {
    const response = await request(server)
      .post('/api/auth/signup')
      .send({
        username: 'someuser@yahoo.com',
        password: 'somepassword',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(response.status).toBe(201);
    const users = await User.findAll();
    expect(users.length).toBe(1);
  });

  it('should return 400 error if password is missing', async () => {
    const response = await request(server)
      .post('/api/auth/signup')
      .send({
        username: 'someuser@yahoo.com',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password is required');
  });

  it('should return 400 error if username is missing', async () => {
    const response = await request(server)
      .post('/api/auth/signup')
      .send({
        password: 'somepassword',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username is required');
  });

  it('should return 400 error if username is not a valid email', async () => {
    const response = await request(server)
      .post('/api/auth/signup')
      .send({
        username: 'someuser',
        password: 'somepassword',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username not a valid email address');
  });

  it('should return 400 error if username already exists', async () => {
    const encrPassword = await hashPassword('somepassword');
    await User.create({
      username: 'someuser@yahoo.com',
      password: encrPassword,
    });
    const response = await request(server)
      .post('/api/auth/signup')
      .send({
        username: 'someuser@yahoo.com',
        password: 'somepassword',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username already exists');
  });
});

const request = require('supertest');

const server = require('./../../../server/server');
const sequelize = require('./../../../db/config/config');
const User = require('./../../../db/models/user');

describe('/api/auth/signup', () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
    } catch (e) {
      console.log(e);
    }
  });

  beforeEach(async () => {
    await User.sync({ force: true });
  });

  afterAll(() => {
    server.close();
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
    try {
      const users = await User.findAll();
      expect(users.length).toBe(1);
    } catch (e) {
      console.log(e);
    }
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

  it('should return 400 error if username is not a valid email', async () => {
    try {
      await User.create({
        username: 'someuser@yahoo.com',
        password: 'somepassword',
      });
    } catch (e) {
      console.log(e);
    }

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

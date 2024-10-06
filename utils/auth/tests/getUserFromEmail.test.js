require('dotenv').config();

const getUserFromEmail = require('./../getUserFromEmail');

const User = require('./../../../db/models/user');
const setupTestDb = require('./../../../test-utils/db/setupTestDb');
const createTestUser = require('./../../../test-utils/db/createTestUser');

describe('getUserFromEmail', () => {
  let sequelize;
  let testUser;

  beforeAll(async () => {
    jest.resetModules();
    sequelize = await setupTestDb();

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
    } catch (e) {
      console.log('Database error');
      console.log(e);
    }
  });

  it('should return a user instance with correct email', async () => {
    const result = await getUserFromEmail('abc@gmail.com');
    expect(result.username).toBe('abc@gmail.com');
  });

  it('should throw an error with incorrect email', async () => {
    try {
      const result = await getUserFromEmail('abc2@gmail.com');
    } catch (e) {
      expect(e).toBe('User not found');
    }
  });
});

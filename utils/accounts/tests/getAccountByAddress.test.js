require('dotenv').config();

const Account = require('./../../../db/models/account');
const setupTestDb = require('./../../../test-utils/db/setupTestDb');

describe('getAccountByAddress', () => {
  let sequelize;

  beforeAll(async () => {
    jest.resetModules();
    sequelize = await setupTestDb();
  });

  beforeEach(async () => {
    try {
      await sequelize.authenticate();
      await Account.destroy({ truncate: { cascade: true } });
    } catch (e) {
      console.log(e);
      console.log('Database error');
      process.exit(1);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should fetch an account instance with correct address', async () => {
    const getAccountByAddress = require('./../getAccountByAddress');

    const testAccount = await Account.create({
      name: 'Test account',
      address: 'addr123',
    });

    const checkAccount = await getAccountByAddress('addr123');
    expect(checkAccount.name).toBe('Test account');
  });

  it('should throw an error if account cannot be found by address', async () => {
    const getAccountByAddress = require('./../getAccountByAddress');

    const testAccount = await Account.create({
      name: 'Test account',
      address: 'addr123',
    });

    try {
      await getAccountByAddress('addr1234');
    } catch (e) {
      expect(e).toBe('Account not found');
    }
  });
});

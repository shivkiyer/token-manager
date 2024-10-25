require('dotenv').config();
const setupTestDb = require('./../../../test-utils/db/setupTestDb');

describe('getAccountsByAddresses', () => {
  let sequelize;
  let Account;
  let testAccounts;

  beforeAll(async () => {
    try {
      jest.resetModules();
      sequelize = await setupTestDb();
    } catch (e) {
      console.log(e);
      console.log('Database setup error');
      process.exit(1);
    }
  });

  beforeEach(async () => {
    try {
      await sequelize.authenticate();
      Account = require('./../../../db/models/account');
      await Account.destroy({ truncate: { cascade: true } });

      testAccounts = [];
      const testAcc1 = await Account.create({
        name: 'Acc 1',
        address: 'addr1',
      });
      testAccounts.push(testAcc1);
      const testAcc2 = await Account.create({
        name: 'Acc 2',
        address: 'addr2',
      });
      testAccounts.push(testAcc2);
    } catch (e) {
      console.log(e);
      console.log('Database error');
      process.exit(1);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should return all accounts if all addresses are in db', async () => {
    const getAccountsByAddresses = require('./../getAccountsByAddresses');

    const result = await getAccountsByAddresses(['addr1', 'addr2']);
    expect(result.length).toBe(2);
  });

  it('should return single account if present in db', async () => {
    const getAccountsByAddresses = require('./../getAccountsByAddresses');

    const result = await getAccountsByAddresses(['addr2']);
    expect(result.length).toBe(1);
  });

  it('should throw an error if accounts are not in db', async () => {
    const getAccountsByAddresses = require('./../getAccountsByAddresses');

    try {
      const result = await getAccountsByAddresses(['addr3']);
    } catch(e) {
      expect(e).toBe('One or more accounts could not be found');
    }
  });

  it('should throw an error if one or more accounts are not in db', async () => {
    const getAccountsByAddresses = require('./../getAccountsByAddresses');

    try {
      const result = await getAccountsByAddresses(['addr1', 'addr2', 'addr3']);
    } catch(e) {
      expect(e).toBe('One or more accounts could not be found');
    }
  });
});

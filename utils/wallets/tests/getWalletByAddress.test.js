require('dotenv').config();
const setupTestDb = require('./../../../test-utils/db/setupTestDb');

describe('getWalletByAddress', () => {
  let sequelize;
  let Wallet;
  let testWallets;

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
      Wallet = require('./../../../db/models/wallet');
      await Wallet.destroy({ truncate: { cascade: true } });
      testWallets = await Wallet.bulkCreate([
        {
          name: 'wall1',
          description: 'descr 1',
          address: 'addr1',
          maxLimit: 0.5,
        },
        {
          name: 'wall2',
          description: 'descr 2',
          address: 'addr2',
          maxLimit: 0.75,
        },
      ]);
    } catch (e) {
      console.log('Database error');
      console.log(e);
      process.exit(1);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should return a wallet if address is present in db', async () => {
    const getWalletByAddress = require('./../getWalletByAddress');

    const result = await getWalletByAddress('addr1');
    expect(result.name).toBe('wall1');
  });

  it('should throw an error if address is not present in db', async () => {
    const getWalletByAddress = require('./../getWalletByAddress');

    try {
      const result = await getWalletByAddress('addr3');
      console.log(result);
    } catch (e) {
      expect(e).toBe('Wallet could not be found');
    }
  });
});

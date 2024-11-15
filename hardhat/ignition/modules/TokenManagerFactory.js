const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

const TokenModule = buildModule('TokenManagerFactoryModule', (m) => {
  const token = m.contract('TokenManagerFactory');

  return { token };
});

module.exports = TokenModule;

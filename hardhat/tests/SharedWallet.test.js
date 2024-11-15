const { ethers } = require('hardhat');

describe('SharedWallet.sol', () => {
  it('should deploy the contract with the correct owner', async () => {
    const [owner] = await ethers.getSigners();

    const withDrawalLimit = 2.5;
    const withDrawalLimitWei = await ethers.parseEther(
      withDrawalLimit.toString()
    );

    const testContract = await ethers.deployContract('SharedWallet', [
      withDrawalLimitWei,
      owner.address,
    ]);

    expect(testContract.target).not.toBe(null);

    const testContractOwner = await testContract.owner();
    expect(testContractOwner).toBe(owner.address);
  });
});

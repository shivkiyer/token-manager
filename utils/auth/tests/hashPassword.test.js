const hashPassword = require('./../hashPassword');

describe('hashPassword', () => {
  it('should not be the same as plain text password', () => {
    const encryptedPassword = hashPassword('somepassword');
    expect(encryptedPassword).not.toBe('somepassword');
  });
});

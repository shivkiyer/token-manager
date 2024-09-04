const emailValidator = require('./../emailValidator');

describe('emailValidator', () => {
  it('Simple email should be valid', () => {
    expect(emailValidator('abc@gmail.com')).toBe(true);
  });

  it('Email with username separated by . should be valid', () => {
    expect(emailValidator('abc.def@gmail.com')).toBe(true);
  });

  it('Email with country in domain should be valid', () => {
    expect(emailValidator('abc.def@gmail.co.ca')).toBe(true);
  });

  it('Plain username should be invalid', () => {
    expect(emailValidator('abc')).toBe(false);
  });

  it('No provider should not be valid', () => {
    expect(emailValidator('abc@com')).toBe(false);
  });

  it('No domain type should not be valid', () => {
    expect(emailValidator('abc@gmail')).toBe(false);
  });
});

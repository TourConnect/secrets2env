const lib = require('../index');
const { exec } = require('child_process');
const fs = require('fs');
const { SecretsManager } = require('aws-sdk');
const { on, infer } = require('aws-promise-jest-mock');

jest.mock('aws-sdk');

const secretFixture = {
  SecretString: JSON.stringify({ demoSecret: 'demoValue' }),
};

async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
// for the test to work a AWS secret with the key
// secrets2env/test should have a key name demoSecret and
// with the value demoValue
describe('required test', () => {
  it('should be able to required the library', async () => {
    const m = on(SecretsManager)
      .mock('getSecretValue', infer)
      .resolve(secretFixture);
    const retVal = await lib.retrieve();
    expect(m.mock).toHaveBeenCalled();
    expect(retVal.demoSecret).toBe('demoValue');
  });
  it('should create a file', async () => {
    const m = on(SecretsManager)
      .mock('getSecretValue', infer)
      .resolve(secretFixture);
    const envFile = `${__dirname}/../.env`;
    if (fs.existsSync(envFile)) fs.unlinkSync(envFile);
    await sh(`${__dirname}/../bin.js`);
    expect(m.mock).toHaveBeenCalled();
    expect(fs.existsSync(envFile)).toBe(true);
  });
  it('should create the env variables', async () => {
    const m = on(SecretsManager)
      .mock('getSecretValue', infer)
      .resolve(secretFixture);
    await lib.config();
    expect(m.mock).toHaveBeenCalled();
    expect(process.env.demoSecret).toBe('demoValue');
  });
});

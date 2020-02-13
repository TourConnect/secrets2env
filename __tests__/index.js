const lib = require('../index');
const { exec } = require('child_process');
const fs = require('fs');

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
    const retVal = await lib.retrieve();
    expect(retVal.demoSecret).toBe('demoValue');
  });
  it('should crate a file', async () => {
    const envFile = `${__dirname}/../.env`;
    if (fs.existsSync(envFile)) fs.unlinkSync(envFile);
    await sh(`${__dirname}/../bin.js`);
    expect(fs.existsSync(envFile)).toBe(true);
  });
  it('should create the env variables', async () => {
    await lib.config();
    expect(process.env.demoSecret).toBe('demoValue');
  });
});

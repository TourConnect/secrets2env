const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

const { env: {
  region = 'us-east-1',
  secretName: SecretId = 'secrets2env/test',
  accessKeyId,
  secretAccessKey,
}} = process;

// Load the AWS SDK with the config
if (accessKeyId && secretAccessKey) {
  AWS.config.update({ accessKeyId, secretAccessKey });
}

// Create a Secrets Manager client
const client = new AWS.SecretsManager({
    region
});
module.exports = async () => {
  const data = await client.getSecretValue({ SecretId }).promise();
  let dotEnvContent = '';
  if ('SecretString' in data) {
    Object.entries(JSON.parse(data.SecretString)).forEach(([attribute, value]) => {
      dotEnvContent += `${attribute}=${value}\n`;
    });
    const writePath = __dirname.split('node_modules/')[0]
    fs.writeFileSync(`${writePath}/.env`, dotEnvContent);
  } else {
    throw new Error('unable to find env secrets');
  }
  return(JSON.parse(data.SecretString));
}

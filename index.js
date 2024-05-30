const {
  GetSecretValueCommand,
  SecretsManagerClient,
} = require("@aws-sdk/client-secrets-manager");
const path = require('path');
const fs = require('fs');

const { env: {
  region = 'us-east-1',
  secretName: SecretId = 'secrets2env/test',
}} = process;

// Create a Secrets Manager client
const client = new SecretsManagerClient({ region });

const retrieve = async () => {
  const data = await client.send(
    new GetSecretValueCommand({
      SecretId,
    }),
  );
  let dotEnvContent = '';
  return(JSON.parse(data.SecretString));
}

const config = async () => {
  const secrets = await retrieve();
  Object.entries(secrets).forEach(([attribute, value]) => {
    process.env[attribute] = value;
  });
}

const createFile = async () => {
  let dotEnvContent = '';
  const secrets = await retrieve();
  Object.entries(secrets).forEach(([attribute, value]) => {
      dotEnvContent += `${attribute}=${value}\n`;
  });
  const writePath = __dirname.split('node_modules/')[0]
  fs.writeFileSync(`${writePath}/.env`, dotEnvContent);
}

module.exports =  {
  retrieve,
  config,
  createFile,
}

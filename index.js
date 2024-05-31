const {
  GetSecretValueCommand,
  SecretsManagerClient,
} = require("@aws-sdk/client-secrets-manager");
const path = require('path');
const fs = require('fs');

const { env: {
  region = 'us-east-1',
  secretName: SecretId = 'secrets2env/test',
  accessKeyId,
  secretAccessKey,
}} = process;

// Create a Secrets Manager client
const client = new SecretsManagerClient({
  region,
  credentials: {
    accessKeyId, // Replace with your actual access key ID
    secretAccessKey, // Replace with your actual secret access key
  }
});

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

const createFile = async (args) => {
  let file = '.env';
  if (args && args.file) {
      file = args.file;
  }
  let dotEnvContent = '';
  const secrets = await retrieve();
  Object.entries(secrets).forEach(([attribute, value]) => {
      dotEnvContent += `${attribute}=${value}\n`;
  });
  const writePath = __dirname.split('node_modules/')[0]
  fs.writeFileSync(`${writePath}/${file}`, dotEnvContent);
}

module.exports =  {
  retrieve,
  config,
  createFile,
}

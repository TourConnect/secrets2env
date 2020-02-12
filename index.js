#!/usr/bin/env node

const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

const { env: {
  region = 'us-east-1',
  secretName = 'staging/frontend',
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

client.getSecretValue({SecretId: secretName}, function(err, data) {
  if (err) {
      console.log('unable to retrieve secrets', err.code);
  } else {
    let dotEnvContent = '';
    if ('SecretString' in data) {
      Object.entries(JSON.parse(data.SecretString)).forEach(([attribute, value]) => {
        dotEnvContent += `${attribute}=${value}\n`;
      });
      const writePath = __dirname.split('node_modules/')[0]
      fs.writeFileSync(`${writePath}/.env`, dotEnvContent);
    } else {
      console.log('unable to find env secrets');
    }
  }
  process.exit(0);
});

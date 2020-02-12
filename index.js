#!/usr/bin/env node

const AWS = require('aws-sdk');

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
        if ('SecretString' in data) {
            Object.entries(JSON.parse(data.SecretString)).forEach(([attribute, value]) => {
              process.env[attribute] = value;
            });
        } else {
          console.log('unable to find env secrets');
        }
    }
  const args = process.argv.slice();
  const indexFound = args.findIndex(el => el.indexOf('secrets2env') > -1)
  if (indexFound < args.length - 1) {
    process.argv.splice(indexFound, 1);// gosth the script
    require(args[indexFound + 1]);
  }
});

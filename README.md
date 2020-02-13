# secrets2env
An executable dependency that would retrieve secrets from AWS and set them up as environment variables.

## how to use

### install the dependency

```
npm install --save @tconnect/secrets2env
```

###  create a .env file using the binary execution

```
./node_modules/.bin/secrets2env && node index.js
```

###  load all vars to process.env for current script

```
const secrets2env = require('@tourconnect/secrets2env'); 

// 2015 version
secrets2env.config.then(function() {
  // all loaded
});
  
// 2019 version
const main = async () => {
  await lib.config();
};
```

## expected env variables

* secretName

and if you are not using a  ~/.aws/credentials file:

* accessKeyId
* secretAccessKey

optionally:

* region

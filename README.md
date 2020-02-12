# secrets2env
An executable dependency that would retrieve secrets from AWS and set them up as environment variables.

## how to use

### install the dependency

```
npm install --save @tourconnect/secrets2envfile
```

### run with it the on a project

```
./node_modules/.bin/loadSecrets && node someScript.js
```

## expected env variables

* secretName

and if you are not using a  ~/.aws/credentials file:

* accessKeyId
* secretAccessKey

optionally:

* region

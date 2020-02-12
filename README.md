# secrets2env
An executable dependency that would retrieve secrets from AWS and set them up as environment variables.

## how to use

### install the dependency

```
npm install --save @tconnect/secrets2env
```

### run with it the on a project

```
./node_modules/.bin/secrets2env && node index.js
```

## expected env variables

* secretName

and if you are not using a  ~/.aws/credentials file:

* accessKeyId
* secretAccessKey

optionally:

* region

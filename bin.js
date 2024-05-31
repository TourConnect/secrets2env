#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const { createFile } = require('./index');

createFile(argv).then(data => {
  process.exit(0);
});

#!/usr/bin/env node
const { createFile } = require('./index');
createFile().then(data => {
  process.exit(0);
});

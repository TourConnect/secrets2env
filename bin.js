#!/usr/bin/env node
const config = require('./index');
config().then(data => {
  process.exit(0);
});

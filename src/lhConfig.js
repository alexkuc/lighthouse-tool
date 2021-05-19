'use strict';

const path = require('path');

module.exports = (device, version) => {
  let relPath = `/config/lr-${device}-config.js`;

  const rootPath = path.dirname(require.resolve(version));

  const configPath = rootPath + relPath;

  const config = require(configPath);

  return config;
};

import path from 'path';

export default (device: string, version: string) => {
  let relPath = `/config/lr-${device}-config.js`;
  const rootPath = path.dirname(require.resolve(version));
  const configPath = rootPath + relPath;
  const config = require(configPath);
  return config;
};

'use strict';

const minimist = require('minimist');

module.exports = (() => {
  const argOpts = {
    alias: {
      w: 'website', // website to test (prefix with 'http[s]://')
      n: 'name', // optional report name (post '.html' is not necessary)
      d: 'directory', // optional directory where to save report
      m: 'mobile', // use mobile config (by default uses desktop)
      v: 'version', // show lighthouse version (npm alias actually)
      f: 'force', // overwrite existing report
      r: 'repeat', // how many times to repeat the report
      c: 'child', // reserved for internal use due to https://github.com/GoogleChrome/lighthouse/issues/9845
    },
  };

  return minimist(process.argv.slice(2), argOpts);
})();

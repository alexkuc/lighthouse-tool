'use strict';

const fs = require('fs');
const minimist = require('minimist');

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

const validation = (args) => {
  if (!args.website) {
    console.error('Specify website name via -w (or --website) argument!');
    process.exit(1);
  }

  if (!new RegExp(/^http[s]?:[\/]{2}/).test(args.website)) {
    console.error('Your url must start with http[s]://<website>!');
    console.error(
      `For example, http://${args.website}, instead of just ${args.website}`
    );
    process.exit(1);
  }

  if (fs.existsSync(args.path) && !args.force) {
    console.error('You already have a report at this path!');
    console.error(args.path);
    process.exit(1);
  }
};

const processArgs = () => {
  const args = minimist(process.argv.slice(2), argOpts);
  validation(args);
  return args;
};

// execute on invocation so that any time this module is required
// I am sure the arguments are validated (this avoids user error)
module.exports = processArgs();

import minimist from 'minimist';
import validatge from './validate';

const argOpts = {
  alias: {
    w: 'website', // website to test (prefix with 'http[s]://')
    n: 'name', // optional report name (post '.html' is not necessary)
    p: 'path', // optional path where to save report
    m: 'mobile', // use mobile config (by default uses desktop)
    v: 'version', // show lighthouse version (npm alias actually)
    f: 'force', // overwrite existing report
    h: 'html', // create report in html format
    j: 'json', // create report in json format
    r: 'repeat', // how many times to repeat the report
  },
};

const args = minimist(process.argv.slice(2), argOpts);

args.repeat = args.repeat ?? 1;
// it appears that minimist converts float into integer
// e.g. passing '8.0' becomes '8'
args.version = parseFloat(args.version).toFixed(1).toString();

validatge(args);

export default args;

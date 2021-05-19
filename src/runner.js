'use strict';

const fs = require('fs');
const process = require('process');

const configMaker = require('./lhConfig');
const { reportName, reportPath, reportVersion } = require('./lhReport');
const chromeLauncher = require('chrome-launcher');

const ora = require('ora');
const changeColor = require('./spinnerColor');

const minimist = require('minimist');

const argOpts = {
  alias: {
    w: 'website', // website to test (prefix with 'http[s]://')
    n: 'name', // optional report name (post '.html' is not necessary)
    d: 'directory', // optional directory where to save report
    m: 'mobile', // use mobile config (by default uses desktop)
    v: 'version', // show lighthouse version (npm alias actually)
    f: 'force', // overwrite existing report
  },
};
const args = minimist(process.argv.slice(2), argOpts);

const report = {
  get website() {
    return args.website;
  },
  get name() {
    return reportName(args.name ?? args.website);
  },
  get folder() {
    return args.directory;
  },
  get device() {
    return args.mobile ? 'mobile' : 'desktop';
  },
  get version() {
    return reportVersion(args.version ?? '7.2.0');
  },
  get path() {
    return reportPath(this.name, this.folder);
  },
};

const lighthouse = require(report.version);

if (!report.website) {
  console.error('Specify website name via -w (or --website) argument!');
  process.exit(1);
}

if (!new RegExp(/^http[s]?:[\/]{2}/).test(report.website)) {
  console.error('Your url must start with http[s]://<website>!');
  console.error(
    `For example, http://${report.website}, instead of just ${report.website}`
  );
  process.exit(1);
}

if (fs.existsSync(report.path) && !args.force) {
  console.error('You already have a report at this path!');
  console.error(report.path);
  process.exit(1);
}

const spinner = ora('Running Lighthouse...').start();

const spinnerInterval = setInterval(() => {
  changeColor(spinner);
}, 250);

(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const options = {
    logLevel: 'silent',
    output: 'html',
    port: chrome.port,
  };

  let runnerResult;

  try {
    runnerResult = await lighthouse(
      report.website,
      options,
      configMaker(report.device, report.version)
    );
  } catch (err) {
    await chrome.kill();
    console.error('Error code: ' + err.code);
    console.error(err.friendlyMessage);
    process.exit(1);
  }

  // save entire lighthouse report as html
  const reportHtml = runnerResult.report;
  fs.writeFileSync(report.path, reportHtml);

  spinner.stop();
  clearInterval(spinnerInterval);

  // show done message and performance result for quick output
  console.log('Report is done for', runnerResult.lhr.finalUrl);
  console.log(
    'Performance score was',
    runnerResult.lhr.categories.performance.score * 100
  );

  await chrome.kill();
})();

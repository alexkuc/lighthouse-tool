'use strict';

const fs = require('fs');
const runner = require('./src/runner');
const { execSync } = require('child_process');
const { reportName, reportPath, reportVersion } = require('./src/lhReport');
const args = require('./src/args');
const path = require('path');

const report = {
  get website() {
    return args.website;
  },
  get name() {
    return reportName(args.name ?? args.website, args.child ?? undefined);
  },
  get directory() {
    return args.directory;
  },
  get device() {
    return args.mobile ? 'mobile' : 'desktop';
  },
  get version() {
    return reportVersion(args.version ?? '7.2.0');
  },
  get path() {
    return reportPath(this.name, this.directory);
  },
  get repeat() {
    return args.repeat ?? 1;
  },
  getChildArgs: function (i) {
    let str = '';
    str += `--website "${this.website}"`;
    str += ` --name "${this.name}"`;
    str += ` --version "${this.version}"`;
    str += args.directory ? ` --directory "${args.directory}"` : '';
    str += args.mobile ? ' --mobile' : '';
    str += args.force ? ' --force' : '';
    str += ` --child ${i}`;
    return str;
  },
};

// child process _cannot_ start w/o passing validation
// b/c parent has to pass validation first!
if (args.child) {
  runner(report);
  return;
}

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

if (report.repeat === 1) {
  runner(report);
  return;
}

if (report.repeat > 1) {
  const reportResults = [];

  for (let i = 1; i <= report.repeat; i++) {
    const stdout = execSync(`yarn custom ${report.getChildArgs(i)}`, {
      encoding: 'utf8',
    }).replace(/\r?\n|\r/g, ' ');

    reportResults.push(JSON.parse(stdout));
  }

  const lhPath = path.dirname(require.resolve(report.version));

  const { computeMedianRun } = require(lhPath + '/lib/median-run.js');

  const { generateReportHtml } = require(lhPath +
    '/report/report-generator.js');

  const median = computeMedianRun(reportResults);

  console.log(
    'Median performance score was',
    median.categories.performance.score * 100
  );

  fs.writeFileSync(report.path, generateReportHtml(median));
}

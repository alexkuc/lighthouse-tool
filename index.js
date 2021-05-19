'use strict';

const fs = require('fs');
const path = require('path');
const args = require('./src/args');
const runner = require('./src/runner');
const report = require('./src/reportConfig');
const { execSync } = require('child_process');

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

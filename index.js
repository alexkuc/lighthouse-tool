'use strict';

const fs = require('fs');
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

if (report.repeat === 1) {
  runner(report);
  return;
}

if (report.repeat > 1) {
  const results = [];

  for (let i = 1; i <= report.repeat; i++) {
    const stdout = execSync(`yarn custom ${report.getChildArgs(i)}`, {
      encoding: 'utf8',
    }).replace(/\r?\n|\r/g, ' ');

    results.push(JSON.parse(stdout));
  }

  const medianReport = report.generateMedianReport(results);

  console.log(
    'Median performance score was',
    medianReport.categories.performance.score * 100
  );

  fs.writeFileSync(report.path, report.convertJsonToHtml(medianReport));
}

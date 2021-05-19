'use strict';

const fs = require('fs');
const args = require('./args');
const process = require('process');
const deviceConfig = require('./deviceConfig');
const chromeLauncher = require('chrome-launcher');

module.exports = async (report) => {
  const lighthouse = require(report.version);
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const options = {
    logLevel: 'silent',
    output: args.child ? 'json' : 'html',
    port: chrome.port,
  };

  let runnerResult;

  try {
    runnerResult = await lighthouse(
      report.website,
      options,
      deviceConfig(report.device, report.version)
    );
  } catch (err) {
    await chrome.kill();
    console.error('Error code: ' + err.code);
    console.error(err.friendlyMessage);
    process.exit(1);
  }

  const reportData = runnerResult.report;

  if (!fs.existsSync(report.path) || args.overwrite) {
    fs.writeFileSync(report.path, reportData);
  }

  // this is required by execSync to receive stdout by parent
  if (args.child) {
    console.log(reportData);
  }

  // show done message and performance result for quick output
  if (!args.child) {
    console.log('Report is done for', runnerResult.lhr.finalUrl);
    console.log(
      'Performance score was',
      runnerResult.lhr.categories.performance.score * 100
    );
  }

  await chrome.kill();
};

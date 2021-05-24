import { writeFileSync } from 'fs';
import path from 'path';
import { stderr, stdout } from 'process';
import args from '../args/args';
import Report from '../report/Report';
import deviceConfig from './deviceConfig';

const report = new Report(args);
const chromeLauncher = require('chrome-launcher');
const lighthouse = require(report.version.toString());

type lhReturn = {
  lhr: object;
};

(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'silent',
    output: 'json',
    port: chrome.port,
  };
  // https://github.com/GoogleChrome/lighthouse/tree/master/types
  let result: lhReturn;

  try {
    result = await lighthouse(
      report.website,
      options,
      deviceConfig(report.device, report.version)
    );
  } catch (err) {
    await chrome.kill();
    stderr.write('Error code: ' + err.code);
    stderr.write(err.friendlyMessage);
    process.exit(1);
  }

  writeFileSync(path.resolve('.', 'test.json'), JSON.stringify(result));

  stdout.write(JSON.stringify(result.lhr));

  await chrome.kill();
})();

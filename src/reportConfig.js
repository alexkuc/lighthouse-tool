'use strict';

const fs = require('fs');
const path = require('path');
const args = require('./args');
const process = require('process');

const report = {
  get website() {
    return args.website;
  },
  get name() {
    return sanitizeName(args.name ?? args.website, args.child ?? undefined);
  },
  get directory() {
    return args.directory;
  },
  get device() {
    return args.mobile ? 'mobile' : 'desktop';
  },
  get version() {
    return validateVersion(args.version ?? '7.2.0');
  },
  get path() {
    return resolvePath(this.name, this.directory);
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
  convertJsonToHtml: function (json) {
    const lhPath = path.dirname(require.resolve(this.version));
    const { generateReportHtml } = require(lhPath +
      '/report/report-generator.js');
    return generateReportHtml(json);
  },
  generateMedianReport: function (jsonArr) {
    const lhPath = path.dirname(require.resolve(this.version));
    const { computeMedianRun } = require(lhPath + '/lib/median-run.js');
    return computeMedianRun(jsonArr);
  },
};

function validateVersion(version) {
  try {
    require.resolve(version);
  } catch (error) {
    throw 'The specified version of the Lighthouse does not exist!';
  }
  return version;
}

// not all characters are allowed in the file name
// so remove unsupported ones
function sanitizeName(websiteName, child) {
  let reportName = websiteName;

  // remove trailing slash
  if (reportName.slice(-1) === '/') {
    reportName = reportName.slice(0, -1);
  }

  // remove http[s]:// prefix
  reportName = reportName.replace(/(http[s]?:[\/]{2})/, '');

  // remove port
  reportName = reportName.replace(/(:[\d]+)$/, '');

  reportName = sanitizeInvalidChars(reportName);

  // add .html extension if missing
  if (!new RegExp(/.html$/).test(reportName)) {
    reportName += '.html';
  }

  if (child) {
    reportName = reportName.replace('.html', `-${child}.json`);
  }

  return reportName;
}

function resolvePath(reportName, folderName) {
  const reportSafeName = sanitizeName(reportName);

  if (folderName) {
    const folderSafeName = sanitizeInvalidChars(folderName);
    const folderPath = path.resolve(process.cwd(), folderSafeName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    return path.resolve(folderPath, reportSafeName);
  }

  return path.resolve(process.cwd(), reportSafeName);
}

// replace illegal characters with dash
// https://stackoverflow.com/a/42210346/4343719
function sanitizeInvalidChars(input) {
  return input.replace(/[/\\?%*:|"<>]/g, '-');
}

module.exports = report;

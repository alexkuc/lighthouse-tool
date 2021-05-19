'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');

module.exports.reportVersion = (version) => {
  try {
    require.resolve(version);
  } catch (error) {
    throw 'The specified version of the Lighthouse does not exist!';
  }
  return version;
};

// not all characters are allowed in the file name
// so remove unsupported ones
module.exports.reportName = (websiteName, child) => {
  let reportName = websiteName;

  // remove trailing slash
  if (reportName.slice(-1) === '/') {
    reportName = reportName.slice(0, -1);
  }

  // remove http[s]:// prefix
  reportName = reportName.replace(/(http[s]?:[\/]{2})/, '');

  // remove port
  reportName = reportName.replace(/(:[\d]+)$/, '');

  reportName = module.exports.illegalChars(reportName);

  // add .html extension if missing
  if (!new RegExp(/.html$/).test(reportName)) {
    reportName += '.html';
  }

  if (child) {
    reportName = reportName.replace('.html', `-${child}.json`);
  }

  return reportName;
};

module.exports.reportPath = (reportName, folderName) => {
  const reportSafeName = module.exports.reportName(reportName);

  if (folderName) {
    const folderSafeName = module.exports.illegalChars(folderName);
    const folderPath = path.resolve(process.cwd(), folderSafeName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    return path.resolve(folderPath, reportSafeName);
  }

  return path.resolve(process.cwd(), reportSafeName);
};

// replace illegal characters with dash
// https://stackoverflow.com/a/42210346/4343719
module.exports.illegalChars = (input) => {
  return input.replace(/[/\\?%*:|"<>]/g, '-');
};

import path from 'path';
import Report from './Report';

export function createHtmlReport(json: object, report: Report): string {
  const lhPath = path.dirname(require.resolve(report.version));
  const filePath = '/report/report-generator.js';
  const { generateReportHtml } = require(lhPath + filePath);
  return generateReportHtml(json);
}

export function createMedianReport(jsonArr: object[], report: Report): object {
  const lhPath = path.dirname(require.resolve(report.version));
  const filePath = '/lib/median-run.js';
  const { computeMedianRun } = require(lhPath + filePath);
  return computeMedianRun(jsonArr);
}

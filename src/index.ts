import { execSync } from 'child_process';
import path from 'path';
import args from './args/args';
import { isEmptyDir } from './report/isEmptyDir';
import { saveReport } from './report/logger';
import Report from './report/Report';
import { createHtmlReport, createMedianReport } from './report/utilities';

const report = new Report(args);

const lhrArr: object[] = [];

for (let i = 0; i < args.repeat; i++) {
  const runner = {
    path: path.resolve(__dirname, './runner/runner.js'),
    args: process.argv.slice(2).join(' '),
  };

  const stdOut = execSync(`yarn node ${runner.path} ${runner.args}`, {
    encoding: 'utf-8',
  });

  lhrArr.push(JSON.parse(stdOut));
}

for (let i = 0; i < lhrArr.length; i++) {
  const lhr = lhrArr[i];
  const postfix = args.repeat === 1 ? '' : i.toString();

  if (args.html) {
    saveReport(
      {
        path: report.path,
        basename: report.basename,
        postfix: postfix,
        extension: 'html',
        data: createHtmlReport(lhr, report),
      },
      args.force
    );
  }

  if (args.json) {
    saveReport(
      {
        path: report.path,
        basename: report.basename,
        postfix: postfix,
        extension: 'json',
        data: JSON.stringify(lhr),
      },
      args.force
    );
  }
}

if (args.repeat > 1) {
  saveReport(
    {
      path: report.path,
      basename: report.basename,
      postfix: 'median',
      extension: 'html',
      data: createHtmlReport(createMedianReport(lhrArr, report), report),
    },
    args.force
  );
}

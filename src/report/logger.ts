import path from 'path';
import { existsSync, writeFileSync } from 'fs';

type fileParams = {
  path: string;
  basename: string;
  prefix?: string;
  postfix?: string;
  extension: string;
  data: string;
};

export function saveReport(args: fileParams, overwrite: boolean = false): void {
  args.prefix = args.prefix ? args.prefix + '-' : '';
  args.postfix = args.postfix ? '-' + args.postfix : '';

  if (!existsSync(args.path)) {
    throw new Error('Chosen path does not exist!');
  }

  // normalize data extension format of ease of use
  if (args.extension.charAt(0) !== '.') {
    args.extension = '.' + args.extension;
  }

  const file = args.prefix + args.basename + args.postfix + args.extension;

  const fullPath = path.resolve(args.path, file);

  if (existsSync(fullPath) && !overwrite) {
    throw new Error('You already have data at the chosen path!');
  }

  writeFileSync(fullPath, args.data);
}

import fs from 'fs';

export function isEmptyDir(path: string): boolean {
  const dirs = fs.readdirSync(path);

  if (dirs.length > 0) {
    return false;
  }

  return true;
}

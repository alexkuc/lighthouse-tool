import fs from 'fs';
import path from 'path';

class Report {
  [index: string]: string | Function;
  website: string;
  basename: string;
  path: string;
  device: string;
  version: '7.2' | '7.3' | '7.5' | '8.0';

  constructor(rawArgs: any) {
    this.validateReportProps(rawArgs);

    this.website = rawArgs.website;
    this.basename = this.sanitizeChars(rawArgs.name ?? rawArgs.website);
    this.path = path.resolve(rawArgs.path ?? '.');
    this.mobile = rawArgs.mobile ?? false;
    this.device = this.mobile ? 'mobile' : 'desktop';
    this.version = rawArgs.version;
    this.force = rawArgs.force ?? false;

    if (this.path && !fs.existsSync(this.path)) {
      fs.mkdirSync(this.path, {
        recursive: true,
      });
    }
  }

  sanitizeChars(unsafeName: string): string {
    return unsafeName.replace(/[/\\?%*:|"<>]/g, '-');
  }

  validateReportProps(rawArgs: any): void {
    if (!rawArgs.website) {
      throw new Error('Specify website name via -w parameter!');
    }

    if (!new RegExp(/^http[s]?:[\/]{2}/).test(rawArgs.website)) {
      throw new Error(
        `You need to prefix website with http[s]://!\n${rawArgs.website}`
      );
    }

    if (!rawArgs.version) {
      throw new Error('Specify Lighthouse version via -v parameter!');
    }

    if (!new RegExp(/^[78]\.[0235]$/).test(rawArgs.version)) {
      throw new Error('Unsupported Lighthouse version is used!');
    }
  }
}

export default Report;

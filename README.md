### Intro

This is a simple Node-based tool to generate Lighthouse reports. Why? First, scripting is fun! Second, running reports manually (PageSpeed Insights or Google Chrome) is a productivity killer. Third, you may want to target different version of Lighthouse.

### Prerequisites

- Google Chrome application (browser)

### Installation

- git clone
- yarn install

### Usage

To get started, you can use one of the available presets and the name of the website.

For example, `yarn run chrome -w 'website'`

To avoid running into "funny things", I recommend to use quotes on the parameters. So instead of `-w http://web.dev/`, do this `-w 'http://web.dev/'`.

Don't forget to prefix website's name with `http://` or `https://`!

There 6 predefined presets:

| preset          | device    | version\* |
| --------------- | --------- | --------- |
| `chrome`        | `desktop` | `7.2.0`   |
| `chrome@mobile` | `mobile`  | `7.2.0`   |
| `psi`           | `desktop` | `7.3.0`   |
| `psi@mobile`    | `mobile`  | `7.3.0`   |
| `next`          | `desktop` | `7.5.0`   |
| `next@mobile`   | `mobile`  | `7.5.0`   |

\* refers to [Lighthouse version](https://github.com/GoogleChrome/lighthouse/releases)

- `desktop` and `mobile` refer to exactly the same configs as found in the Google Chrome
- source code for these files can be found [here](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/lr-desktop-config.js) and [here](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/lr-mobile-config.js)
- `psi` stands for [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)

These are the available parameters:

| parameter           | description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `-w`, `--website`   | website to test (requires `http://` or `https://` prefix) \* |
| `-n`, `--name`      | report name (adding `.html` is not necessary)                |
| `-d`, `--directory` | directory where to save report, resolved relative to `pwd`   |
| `-m`, `--mobile`    | use mobile config, by default desktop config is used         |
| `-v`, `--version`   | specifies Lighthouse version, by default `7.2.0` is used     |
| `-f`, `--force`     | overwrite report if one exists in the destination path       |

\* are the required parameters

### Advanced Usage

This tool uses [Yarn 2 Pnp](https://yarnpkg.com/features/pnp), which means that to use the `index.js`, use the following format:

`yarn node index.js <parameters>`

Remember, that the only required parameter is `-w` which is the websites name. Don't forget to quote it!

For example, `yarn node index.js -w 'http://web.dev'`

There is a preset for this: `yarn run custom <parameters>`

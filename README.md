### Intro

This is a simple Node-based tool to generate Lighthouse reports. Why? First, scripting is fun! Second, running reports manually (PageSpeed Insights or Google Chrome) is a productivity killer. Third, you may want to target different version of Lighthouse.

### Prerequisites

- Google Chrome application (browser)

### Installation

- git clone
- yarn install
- yarn build

### Usage

Here is a complete example to get you started quickly:

`yarn custom -w 'https://web.dev/' -n 'web-dev' -p ./ -v 8.0 -h`

This will run a desktop config against website https://web.dev/ which will save the report into the current folder in HTML format using 8.0 [Lighthouse version](https://github.com/GoogleChrome/lighthouse/releases) with the name web-dev.

For full explanation of parameters see the relevant table below.

To avoid running into "funny things", I recommend to use quotes on the parameters. So instead of `-w http://web.dev/`, do this `-w 'http://web.dev/'`.

Don't forget to prefix website's name with `http://` or `https://`!

### Presets

| preset       |  device   | version\* |
| ------------ | :-------: | :-------: |
| `chrome`     | `desktop` |   `7.2`   |
| `chrome@m`   | `mobile`  |   `7.2`   |
| `psi`        | `desktop` |   `7.3`   |
| `psi@m`      | `mobile`  |   `7.3`   |
| `next`       | `desktop` |   `7.5`   |
| `next@m`     | `mobile`  |   `7.5`   |
| `custom`\*\* | `desktop` |    n\a    |

\* refers to [Lighthouse version](https://github.com/GoogleChrome/lighthouse/releases)

\*\* this is simply a shortcut for `node dist/index.js`

- `desktop` and `mobile` refer to exactly the same configs as found in the Google Chrome
- source code for these files can be found [here](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/lr-desktop-config.js) and [here](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/lr-mobile-config.js)
- `psi` stands for [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)

### Parameters

| parameter         | description                                                  | required |
| ----------------- | ------------------------------------------------------------ | :------: |
| `-w`, `--website` | website to test (requires `http://` or `https://` prefix) \* |    \*    |
| `-n`, `--name`    | report name (do NOT add filename extension!)                 |    \*    |
| `-p`, `--path`    | path to which report(s) will be saved                        |    \*    |
| `-m`, `--mobile`  | use mobile config, by default desktop config is used         |          |
| `-v`, `--version` | specifies Lighthouse version                                 |    \*    |
| `-f`, `--force`   | overwrite report if one exists in the destination path       |          |
| `-h`, `--html`    | save report(s) to HTML format                                |   \*\*   |
| `-j`, `--json`    | save report(s) to JSON format                                |   \*\*   |
| `-r`, `--repeat`  | how many times to repeat the report, by default 1            |          |

\* are the required parameters

\*\* you can specify either of the parameters (i.e. not necessary to specify both!)

### Lighthouse Versions

| version |
| :-----: |
|   7.2   |
|   7.3   |
|   7.5   |
|   8.0   |

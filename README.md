This will write the version and build number to your Cordova projects config.xml file
Version numbers will follow the Semantic Versioning system (https://semver.org/) 
which would already be used in the project.json file
The build number will use the semver system as a 6 digit version such as `42069` to designate the major.minor.patch version `4.20.69`
you can set your own version and build numbers using the -v for version and -b for build

## Features

-   Writes `version` and `buildNumber` to Cordova `config.xml`
-   Can read `version` from local `package.json`
-   Only update android or ios build number if you wish (from an app review rejection)
-   Can work on Cordova Plugin projects
-   Replaces {{cdvverctrl}} with `version` in config.xml when the `-e` option is enabled. See [Extra option below](https://github.com/lilmnm-kamikaze-/Cordova-Version-Control#extra). 
-   Has CLI

## Install

```sh
$ npm install cordova-version-control
```

## Usage

```js
const cdvVerCrtl = require('cordova-version-control');

cdvVerCrtl(); // reads version from package.json
cdvVerCrtl('4.20.69');
cdvVerCrtl('./plugin.xml', '4.20.69');
cdvVerCrtl('./path/to/config.alt.xml', 69);
cdvVerCrtl('./path/to/config.alt.xml', '4.20.69', 69)
    .catch(error => { ... });
```

## API

`cdvVerCrtl([configPath], [version], [buildNumber], [android], [ios], [extra]): Promise`

-   `configPath` _(string)_ - path to your `config.xml` or `plugin.xml`
-   `version` _(string)_ - version to be written
-   `buildNumber` _(number)_ - build number to be written
-   `android` _(bool)_ - sets if you only want to write android build number, ignored for plugins
-   `ios` _(bool)_ - sets if you only want to write android build number, ignored for plugins
-   `extra` _(bool)_ - enables the extra version locations in config.xml

Important notes:
You can not have `android` and `ios` both as true. Only use one at a time or set both to false to write both android and ios build numbers.


## CLI

`cdvversioncrtl [-v|--version <version>] [-b|--build-number <build-number>] [-a|--android-only] [-i|--ios-only] [-e|--extra] [config.xml]`

Options:

-   `-v`/`--version` - version to set
-   `-b`/`--build-number` - build number to set
-   `-a`/`--androidOnly` - only set android build number, ignored for plugins
-   `-i`/`--iosOnly` - only set ios build number, ignored for plugins
-   `-e`/`--extra` - enables the extra version locations in config.xml
-   `--help` - display help

Important notes:
You can not use `-a` and `-i` options at the same time. Only use one at a time or don't include them to write both android and ios build numbers.


## Extra option -e,--extra
To use the extra you will need to add `{{cdvverctrl}}` where you want to add the verion to in the config.xml.
For example, if you have a version of 4.20.69.
```xml
<description>
    Some meme cordova app {{cdvverctrl}}!!
</description>

```
will become 
```xml
<description>
    Some meme cordova app 4.20.69!!
</description>

```

## Use with [Standard Version](https://www.npmjs.com/package/standard-version)
if you want this to use the version when you run standard-version. You can have this run during the life cycle after the version bump.
To do you you will need to add the following to your package.json. you can edit it as you see fit but you will need to commit the new changes to the config.xml file.
```JSON
"scripts": {
    "release": "standard-version"
  },
"standard-version": {
    "scripts": {
      "postbump": "verctrl -e && git add -A && git commit -a -m \"chore(cordova-version): bumped config.xml versions\""
    }
  }

```
Running `npm run release` will use standard-version to bump the version in the package.json file.
It then calls verctrl to have it take that version and add it to the config.xml file. Which will then add the changes and then commit the changes.


## Examples

```
$ cdvversioncrtl -v 2.4.9 plugin.xml
$ cdvversioncrtl -b 86
$ cdvverctrl -v 2.4.9 -b 86
$ cdvverctrl (gets version from project package.json)
```
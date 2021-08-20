#!/usr/bin/env node

import meow from 'meow';

import cdvVerCrtl from './main';

const help = `
    For ease of use, I recommend using standard-version to handle bump files and changelog creation.
    This CLI app should be used after running the standard-version bump but can also be used with out it.

    Usage
      $ cdvversioncrtl [-v|--version <version>] [-b|--build-number <build-number>] [-a|--android-only] [-i|--ios-only] [-e|--extra] [config.xml]
    
    Options
      -v, --version Version to set
      -b, --build-number Build number to set
      -a, --android-only update only android build number
      -i, --ios-only update only ios build number
      -e, --extra add the version to other places in the config.xml
      
    Examples
      $ cdvversioncrtl -v 2.4.9
      $ cdvversioncrtl -b 86
      $ cdvverctrl -v 2.4.9 -b 86
      $ cdvverctrl (gets version from project package.json)
`;

const options = {
    flags: {
        version: {
            type: 'string',
            alias: 'v',
        },
        buildNumber: {
            type: 'string',
            alias: 'b',
        },
        androidOnly: {
            type: 'boolean',
            alias: 'a',
        },
        iosOnly: {
            type: 'boolean',
            alias: 'i',
        },
        extra: {
            type: 'boolean',
            alias: 'e',
        },
        template: {
            type: 'string',
            alias: 't',
        },
    },
    help,
    autoVersion: false,
};

const cli = meow(options);

const configPath = cli.input[0] || null;
const version = cli.flags.version || null;
const buildNumber = +cli.flags.buildNumber || null;
const android = cli.flags.androidOnly || false;
const ios = +cli.flags.iosOnly || false;
const extra = +cli.flags.extra || false;
const templatePath = +cli.flags.template || null;


cdvVerCrtl({ configPath, version, buildNumber, android, ios, extra, templatePath });
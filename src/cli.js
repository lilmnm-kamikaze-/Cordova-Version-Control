#!/usr/bin/env node

/**
 * Versions will follow the Semantic Versioning system (https://semver.org/)
 * Build versions will use the semver system as a 6 digit version e.g. 1.55.3 => 15503 (starting 0 is ignored)
 */

import meow from 'meow';
import cdvVerCrtl from '.';

const help = `
    For ease of use, I recommend using standard-version to handle bump files and changelog creation.
    This CLI app should be used after running the standard-version bump but can also be used with out it.

    Usage
      $ cdvversioncrtl [-v|--version <version>] [-b|--build-number <build-number>] [-a|--android-only] [-i|--ios-only] [config.xml]
    
    Options
      -v, --version Version to set
      -b, --build-number Build number to set
      -a, --android-only update only android build number
      -i, --ios-only update only ios build number
      
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
            type: 'bool',
            alias: 'a',
        },
        iosOnly: {
            type: 'bool',
            alias: 'i',
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


cdvVerCrtl({ configPath, version, buildNumber,, android, ios });
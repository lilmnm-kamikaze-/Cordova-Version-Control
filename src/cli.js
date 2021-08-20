#!/usr/bin/env node

import meow from 'meow';

import cdvVerCrtl from './main';

const help = `
    For ease of use, I recommend using standard-version to handle bump files and changelog creation.
    This CLI app should be used after running the standard-version bump but can also be used with out it.

    Usage
      $ cdvversioncrtl [-v|--version <version>] [-b|--build-number <build-number>] [-a|--android-only] [-i|--ios-only] [-e|--extra] [-t|--template] [-p|--plugin] [config.xml]
    
    Options
      -v, --version Version to set
      -b, --build-number Build number to set
      -a, --android-only update only android build number
      -i, --ios-only update only ios build number
      -e, --extra add the version to other places in the config file
      -t, --template path to a config or plugin file to read from
      -p, --plugin designate that this is a cordova plugin project and saves to a plugin.xml file
      
    Examples
      $ cdvversioncrtl -v 2.4.9 -p plugin.xmln
      $ cdvversioncrtl -b 86
      $ cdvverctrl -v 2.4.9 -b 86
      $ cdvverctrl (gets version from project package.json)
      $ verctrl -t config.xml.cfg -e
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
        plugin: {
            type: 'boolean',
            alias: 'p',
        }
    },
    help,
    autoVersion: false,
};

const cli = meow(options);

const configPath = cli.input[0] || null;
const version = cli.flags.version || null;
const buildNumber = cli.flags.buildNumber || null;
const android = cli.flags.androidOnly || false;
const ios = cli.flags.iosOnly || false;
const extra = cli.flags.extra || false;
const template = cli.flags.template || null;
const plugin = cli.flags.plugin || false;

cdvVerCrtl({ configPath, version, buildNumber, android, ios, extra, template, plugin });
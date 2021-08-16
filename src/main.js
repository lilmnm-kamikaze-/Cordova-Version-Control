#!/usr/bin/env node

/**
 * Versions will follow the Semantic Versioning system (https://semver.org/)
 * Build versions will use the semver system as a 6 digit version e.g. 1.55.3 => 15503 (starting 0 is ignored)
 */

import chalk from 'chalk';
import fs from 'fs';
import promisify from 'util-promisify';
import xml2js from 'xml2js-es6-promise';
import { Builder } from 'xml2js';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const log = console.log;

const xmlBuilder = new Builder();

function checkTypeErrors(configPath, version, buildNumber) {
    if (typeof configPath !== 'string') {
        throw TypeError('"configPath" argument must be a string');
    }

    if (version && typeof version !== 'string') {
        throw TypeError('"version" argument must be a string');
    }

    if (buildNumber && typeof buildNumber !== 'number') {
        throw TypeError('"buildNumber" argument must be an integer');
    }

    if (buildNumber && buildNumber !== parseInt(buildNumber, 10)) {
        throw TypeError('"buildNumber" argument must be an integer');
    }
}

async function getXml(configPath) {
    const configFile = await readFile(configPath, 'UTF-8');

    return xml2js(configFile);
}

async function getVersionFromPackage() {
    const packageFile = await readFile('./package.json', 'UTF-8');
    const pkg = JSON.parse(packageFile);
    const { version } = pkg;

    return version;
}

function setAttributes(xml, version, buildNumber, android, ios) {
    const newXml = xml;
    const el = newXml.plugin ? 'plugin' : 'widget';

    if (version) {
        newXml[el].$.version = version;
    }
    if(!buildNumber){
        const [major, minor, patch] = version.split('.');
        buildNumber = (major * 10000) + (minor * 100) + patch
    }

    if (el === 'widget' && buildNumber) {
        if (android) {
            newXml.widget.$['android-versionCode'] = buildNumber;
        } else if (ios){
            newXml.widget.$['ios-CFBundleVersion'] = buildNumber;
        } else {
            newXml.widget.$['android-versionCode'] = buildNumber;
            newXml.widget.$['ios-CFBundleVersion'] = buildNumber;
        }
    }

    return newXml;
}

if(android && ios){
    console.error('%s Please only use one -a or -i options at a time. Don\'t use either to update both android and ios build numbers.', chalk.red.bold('ERROR!'));
    process.exit(1);
}

async function cdvVerCrtl({ configPath, version, buildNumber, android, ios } = {}) {
    const cPath = configPath || './config.xml';

    checkTypeErrors(cPath, version, buildNumber);

    const currentConfig = await getXml(cPath);

    const v = !version && !buildNumber ? await getVersionFromPackage(version) : version;

    const newConfig = setAttributes(currentConfig, v, buildNumber, android, ios);

    const newData = xmlBuilder.buildObject(newConfig);
    return writeFile(cPath, newData, { encoding: 'UTF-8' });
}

export default cdvVerCrtl;


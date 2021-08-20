#!/usr/bin/env node

/* Versions will follow the Semantic Versioning system (https://semver.org/)
 * Build versions will use the semver system as a 6 digit version e.g. 1.55.3 => 15503 (starting 0 is ignored)
 */

import chalk from 'chalk';
import fs from 'fs';
import promisify from 'util-promisify';
import xml2js from 'xml2js-es6-promise';
import { Builder } from 'xml2js';
import { evaluate } from 'mathjs';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const log = console.log;

const xmlBuilder = new Builder({'newline': '\r\n'});

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

async function getXml(configPath, templatePath) {
    if(templatePath){
        const configFile = await readFile(templatePath, 'UTF-8');
    } else {
        const configFile = await readFile(configPath, 'UTF-8');
    }

    return xml2js(configFile);
}

async function getVersionFromPackage() {
    const packageFile = await readFile('./package.json', 'UTF-8');
    const pkg = JSON.parse(packageFile);
    const { version } = pkg;

    return version;
}

function setAttributes(xml, version, buildNumber, android, ios, extra) {
    let newXml = xml;
    const el = newXml.plugin ? 'plugin' : 'widget';

    if (version) {
        newXml[el].$.version = version;
    }
    if(!buildNumber){
        const [major, minor, patch] = version.split('.');
        console.log('%s The version being saved to config.xml is %d.%d.%d.', chalk.green.bold('INFO!'), major, minor, patch);
        buildNumber = evaluate('(' + major + ' * 10000) + (' + minor + ' * 100) + (' + patch + ')');
        console.log('%s The The build numbe writen to config.xml is %d.', chalk.green.bold('INFO!'), buildNumber);
    }
    if(extra){
        console.log('%s The extra tag is enabled changing {{cdvverctrl}} to %s in config.xml', chalk.green.bold('INFO!'), version);
        // {{cdvverctrl}} this is what we will look for to replace
        try{
            newXml = JSON.parse(JSON.stringify(newXml).replace('{{cdvverctrl}}', version));
        } catch {
            console.log('%s You need to add {{cdvverctrl}} in config.xml to use the extra option!', chalk.red.bold('ERROR!'), version);
        }
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

async function cdvVerCrtl({ configPath, version, buildNumber, android, ios, extra, templatePath } = {}) {
    const cPath = configPath || './config.xml';

    if (android && ios) {
      console.error('%s Please only use one -a or -i options at a time. Don\'t use either to update both android and ios build numbers.', chalk.red.bold('ERROR!'));
      process.exit(1);
    }

    checkTypeErrors(cPath, version, buildNumber);

    const currentConfig = await getXml(cPath, templatePath);

    const v = !version && !buildNumber ? await getVersionFromPackage(version) : version;

    const newConfig = setAttributes(currentConfig, v, buildNumber, android, ios, extra);

    const newData = xmlBuilder.buildObject(newConfig);
    return writeFile(cPath, newData, { encoding: 'UTF-8' });
}

export default cdvVerCrtl;
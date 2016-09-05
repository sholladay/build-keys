'use strict';

const path = require('path');
const glob = require('glob');
const buildData = require('build-data');

const keyGlob = (pattern, option) => {
    const config = Object.assign({}, option, {
        nodir : true
    });
    return new Promise((resolve, reject) => {
        glob(pattern, config, (err, filePaths) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(filePaths);
        });
    });
};

const globVersions = (...versions) => {
    if (versions.length < 2) {
        return versions[0];
    }

    const reduced = versions.reduce((accumulated, version) => {
        if (!version) {
            return accumulated;
        }

        return accumulated ? accumulated + ',' + version : version;
    });

    return '{' + reduced + '}';
};

const buildKeys = {};

buildKeys.latest = (option) => {
    const config = Object.assign({}, option);
    const cwd = config.cwd = path.resolve(config.cwd || '');

    return buildData.latest(config).then((data) => {
        const versions = [data.version];
        if (config.includeBranchLatest) {
            versions.push('latest');
        }

        const pattern = [data.branch, globVersions(...versions), '**'].join('/');

        return keyGlob(pattern, Object.assign({}, config, {
            cwd    : path.join(cwd, 'build'),
            follow : true,
            noext  : true
        }));
    });
};

module.exports = buildKeys;

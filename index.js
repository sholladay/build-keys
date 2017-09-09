'use strict';

const { promisify } = require('util');
const path = require('path');
const glob = require('glob');
const buildData = require('build-data');

const pGlob = promisify(glob);

const globVersions = (...versions) => {
    if (versions.length < 2) {
        return versions[0];
    }

    const csv = versions.reduce((accumulated, version) => {
        if (!version) {
            return accumulated;
        }
        return accumulated ? accumulated + ',' + version : version;
    });

    return '{' + csv + '}';
};

const buildKeys = {};

buildKeys.latest = async (option) => {
    const config = Object.assign(
        {
            includeBranchLatest : true
        },
        option
    );
    const cwd = path.resolve(config.cwd || '');
    config.cwd = cwd;

    const data = await buildData.latest(config);

    const versions = [data.version];
    if (config.includeBranchLatest) {
        versions.push('latest');
    }

    const pattern = `${data.branch}/${globVersions(...versions)}/**`;

    return pGlob(pattern, Object.assign({}, config, {
        cwd    : path.join(cwd, 'build'),
        follow : true,
        noext  : true,
        nodir  : true
    }));
};

module.exports = buildKeys;

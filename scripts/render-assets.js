'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');

module.exports = function renderAssets() {
    const sourcePath = upath.resolve(upath.dirname(__filename), '../src/assets');
    const publicPath = upath.resolve(upath.dirname(__filename), '../src/public');
    const destPath = upath.resolve(upath.dirname(__filename), '../dist/.');
    
    sh.cp('-R', sourcePath, destPath)
    if (sh.test('-d', publicPath)) {
        sh.cp('-R', `${publicPath}/*`, destPath)
    }
};

const path = require('path');
const fs = require('fs');

const FileUtils = require('../FileUtils');
const flayProperties = require('../flayProperties');

console.log('flaySource init');

const foundFileList = new Array();

const folderList = flayProperties.BASE_PATH;

for (const folder of folderList) {
    const foundFiles = FileUtils.listFiles(folder);
    foundFileList.push(...foundFiles);
}

console.log('flaySource', 'found file length', foundFileList.length);

module.exports = {
    list: () => {
        return foundFileList;
    },
};

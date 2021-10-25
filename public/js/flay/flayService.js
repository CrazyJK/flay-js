const path = require('path');
const fs = require('fs');

const FileUtils = require('../utils/FileUtils');
const flayProperties = require('./flayProperties');

const BASE_PATH = path.resolve(flayProperties.get('base.path'));

let fileList = [];

const list = () => {
  if (fileList.length === 0) {
    setAllFiles();
  }
  return fileList;
};

const get = (id) => {
  return list()[id];
};

module.exports = { list, get };

function setAllFiles() {
  fileList = FileUtils.listFiles(BASE_PATH);
}

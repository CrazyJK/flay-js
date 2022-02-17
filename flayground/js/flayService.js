const path = require('path');

const FileUtils = require('./FileUtils');
const flayProperties = require('./flayProperties');

const BASE_PATH = path.resolve(flayProperties.get('base.path'));

let fileList = [];

module.exports = {
	list: () => {
		if (fileList.length === 0) {
			setAllFiles();
		}
		return fileList;
	},
	get: (id) => {
		return list()[id];
	},
};

function setAllFiles() {
	fileList = FileUtils.listFiles(BASE_PATH);
}

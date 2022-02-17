const fs = require('fs');
const path = require('path');
const propertiesReader = require('properties-reader');

console.log('flaySource init');

const properties = propertiesReader('application.properties');

const flaySource = {
	foundFileList: new Array(),
	init: () => {
		const folder = properties.get('flay.folder');
		console.log(`properties folder [${folder}]`);

		const folderList = folder.split(',').map((f) => f.trim());
		for (const folder of folderList) {
			const foundFiles = listFile(folder);
			flaySource.foundFileList.push(...foundFiles);
		}
		console.log('flaySource', 'found file length', flaySource.foundFileList.length);
	},
	list: () => {
		return flaySource.foundFileList;
	},
};

const listFile = (dirPath, fileList) => {
	const files = fs.readdirSync(dirPath);
	fileList = fileList || [];
	files.forEach((file) => {
		if (fs.statSync(dirPath + '/' + file).isDirectory()) {
			fileList = listFile(dirPath + '/' + file, fileList);
		} else {
			fileList.push(path.join(dirPath, '/', file));
			// console.debug('flaySource', dirPath, file);
		}
	});
	return fileList;
};

flaySource.init();

module.exports = flaySource;

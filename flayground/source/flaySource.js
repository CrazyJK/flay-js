const path = require('path');
const fs = require('fs');

const Flay = require('../domain/Flay');
const FileUtils = require('../FileUtils');
const flayProperties = require('../flayProperties');

console.log('flaySource init');

const folderList = flayProperties.BASE_PATH;

// collecting files
const foundFileList = new Array();
for (const folder of folderList) {
	const foundFiles = FileUtils.listFiles(folder);
	foundFileList.push(...foundFiles);
}

// making Flay list
const flayMap = new Map();
for (const file of foundFileList) {
	const namePart = file.name.replace(/[[]/gi, '').split(']');
	// console.log(namePart);
	const studio = namePart[0];
	const opus = namePart[1];
	const title = namePart[2];
	const actressArray = namePart[3].split(',').map((name) => name.trim());
	const release = namePart[4];

	let flay = flayMap.get(opus);
	if (!flay) {
		flay = new Flay(studio, opus, title, actressArray, release);
		flayMap.set(opus, flay);
	}
	flay.addFile(file);
}
console.log('flayMap', flayMap);

console.log('flaySource', 'found file length', foundFileList.length);

module.exports = {
	listFiles: () => {
		return foundFileList;
	},
	getMap: () => {
		return flayMap;
	},
};

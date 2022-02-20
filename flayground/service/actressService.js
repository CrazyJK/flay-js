const path = require('path');
const fs = require('fs');

const flayProperties = require('../flayProperties');

const actressJsonPath = path.resolve(flayProperties.INFO_PATH, 'actress.json');

console.log('actressService', 'reading', actressJsonPath);
const rowData = fs.readFileSync(actressJsonPath, 'utf8');
const actressList = JSON.parse(rowData);
console.log('actressService', 'read data', actressList.length);

module.exports = {
	list: () => {
		return actressList;
	},
	get: (name) => {
		for (const actress of actressList) {
			if (actress.name === name) {
				return actress;
			}
		}
		return {
			name: name,
			localName: null,
			birth: null,
			body: null,
			height: 0,
			debut: 0,
			comment: null,
			favorite: false,
			coverSize: 0,
		};
	},
};

const path = require('path');
const flaySource = require('../source/flaySource');

module.exports = {
	listFiles: () => {
		return flaySource.listFiles();
	},
	getMap: () => {
		return flaySource.getMap();
	},
	get: (id) => {
		return flaySource.list()[id];
	},
};

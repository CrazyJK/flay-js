const flaySource = require('../source/flaySource');

module.exports = {
	listFiles: () => {
		return flaySource.listFiles();
	},
	getMap: () => {
		return flaySource.getMap();
	},
	list: () => {
		return flaySource.list();
	},
	get: (opus) => {
		return flaySource.getMap().get(opus);
	},
};

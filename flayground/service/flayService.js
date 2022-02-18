const path = require('path');
const flaySource = require('../source/flaySource');

module.exports = {
	list: () => {
		return flaySource.list();
	},
	get: (id) => {
		return flaySource.list()[id];
	},
};

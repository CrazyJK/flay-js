const path = require('path');
const propertiesReader = require('properties-reader');

const flayProperties = propertiesReader('flayground/flay.properties');
console.log('flayProperties', 'loaded');

let instancePath = flayProperties.get('flay.stage-paths').split(',');
instancePath.push(flayProperties.get('flay.storage-path'));
instancePath.push(flayProperties.get('flay.cover-path'));

module.exports = {
	INSTANCE_PATH: instancePath.map((path) => path.trim()),
	INFO_PATH: flayProperties.get('flay.info-path'),
	PLAYER: flayProperties.get('flay.player-app').trim(),
};

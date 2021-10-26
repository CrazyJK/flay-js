const path = require('path');
const PropertiesReader = require('properties-reader');

const propertiesPath = path.join(__dirname, 'flay.properties');
console.log('propertiesPath', propertiesPath);

const flayProperties = PropertiesReader(propertiesPath);
console.log('flayProperties', flayProperties);

module.exports = flayProperties;

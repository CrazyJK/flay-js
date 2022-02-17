const path = require('path');
const propertiesReader = require('properties-reader');

// const propertiesPath = path.join(__dirname, '/flayground/flay.properties');
// console.log('propertiesPath', propertiesPath);

// const flayProperties = propertiesReader(propertiesPath);
const flayProperties = propertiesReader('flayground/flay.properties');
console.log('flayProperties', flayProperties);

module.exports = flayProperties;

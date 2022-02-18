const path = require('path');
const propertiesReader = require('properties-reader');

const flayProperties = propertiesReader('flayground/flay.properties');
console.log('flayProperties', flayProperties);

module.exports = {
    BASE_PATH: flayProperties
        .get('base.path')
        .split(',')
        .map((path) => path.trim()),
};

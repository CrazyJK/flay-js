import propertiesReader from 'properties-reader';

const flayProperties = propertiesReader('flayground/flay.properties');
console.log('flayProperties', 'loaded');

let instancePath = flayProperties.get('flay.stage-paths').split(',');
instancePath.push(flayProperties.get('flay.storage-path'));
instancePath.push(flayProperties.get('flay.cover-path'));

export const INSTANCE_PATH = instancePath.map((path) => path.trim());
export const INFO_PATH = flayProperties.get('flay.info-path');
export const PLAYER = flayProperties.get('flay.player-app').trim();

import propertiesReader from 'properties-reader';
import dotenv from 'dotenv';

dotenv.config();
const config = process.env.CONFIG;

const flayProperties = propertiesReader(`src/config/flay${config ? '-' + config : ''}.properties`);
console.log('flayProperties', 'loaded');

export const INSTANCE_PATH = [...flayProperties.get('flay.stage-paths').split(','), flayProperties.get('flay.storage-path'), flayProperties.get('flay.cover-path')].map((path) => path.trim());
export const INFO_PATH = flayProperties.get('flay.info-path');
export const PLAYER = flayProperties.get('flay.player-app').trim();
export const ARCHIVE_PATH = flayProperties.get('flay.archive-path').trim();
export const STORAGE_PATH = flayProperties.get('flay.storage-path').trim();

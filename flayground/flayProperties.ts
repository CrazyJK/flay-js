import propertiesReader from 'properties-reader';

const flayProperties = propertiesReader('flayground/flay.properties');

const statePaths = flayProperties.get('flay.stage-paths') as string;
const storagePath = flayProperties.get('flay.storage-path') as string;
const coverPath = flayProperties.get('flay.cover-path') as string;
const infoPath = flayProperties.get('flay.info-path') as string;
const playerApp = flayProperties.get('flay.player-app') as string;

let instancePath = [...statePaths.split(','), storagePath, coverPath];

export const INSTANCE_PATH = instancePath.map((path) => path.trim());
export const INFO_PATH = infoPath.trim();
export const PLAYER = playerApp.trim();

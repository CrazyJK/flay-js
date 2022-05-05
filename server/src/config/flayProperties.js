import propertiesReader from 'properties-reader';
import dotenv from 'dotenv';

dotenv.config();
const config = process.env.CONFIG;

const flayPropertiesPath = `src/config/flay${config ? '-' + config : ''}.properties`;
const flayProperties = propertiesReader(flayPropertiesPath);
console.log('flayProperties', 'loaded', flayPropertiesPath);

const coverPath = flayProperties.get('flay.cover-path').trim();
const storagePath = flayProperties.get('flay.storage-path').trim();
const archivePath = flayProperties.get('flay.archive-path').trim();
const infoPath = flayProperties.get('flay.info-path').trim();
const candidatePath = flayProperties.get('flay.candidate-path').trim();
const subtitlesPath = flayProperties.get('flay.subtitles-path').trim();
const playerApp = flayProperties.get('flay.player-app').trim();
const stagePaths = flayProperties
  .get('flay.stage-paths')
  .split(',')
  .map((path) => path.trim());
const todayisPaths = flayProperties
  .get('flay.todayis-paths')
  .split(',')
  .map((path) => path.trim());
const imagePaths = flayProperties
  .get('flay.image-paths')
  .split(',')
  .map((path) => path.trim());

export const ARCHIVE_PATH = archivePath;
export const INSTANCE_PATH = [...stagePaths, coverPath, storagePath];
export const STORAGE_PATH = storagePath;
export const STAGE_PATHs = stagePaths;
export const INFO_PATH = infoPath;
export const CANDIDATE_PATH = candidatePath;
export const SUBTITLES_PATH = subtitlesPath;
export const PLAYER = playerApp;
export const TODAYIS_PATH = todayisPaths;
export const IMAGE_PATHs = imagePaths;

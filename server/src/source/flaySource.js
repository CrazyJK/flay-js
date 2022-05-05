import Flay from '../domain/Flay.js';
import FileUtils from '../utils/FileUtils.js';
import videoService from '../service/videoService.js';
import { INSTANCE_PATH } from '../config/flayProperties.js';

const instanceFolderList = INSTANCE_PATH;

let flayMap = new Map();

function load() {
  // collecting files
  const foundFileList = new Array();
  for (const folder of instanceFolderList) {
    console.log('flaySource', 'reading', folder);
    const foundFiles = FileUtils.listFiles(folder);
    foundFileList.push(...foundFiles);
  }
  console.log('flaySource', 'foundFileList length', foundFileList.length);

  // making Flay Map
  flayMap = new Map();
  for (const file of foundFileList) {
    const namePart = file.name.replace(/[[]/gi, '').split(']');
    const studio = namePart[0];
    const opus = namePart[1];
    const title = namePart[2];
    const actressArray = namePart[3].split(',').map((name) => name.trim());
    const release = namePart[4];

    let flay = flayMap.get(opus);
    if (!flay) {
      flay = new Flay(studio, opus, title, actressArray, release);
      flay.setVideo(videoService.get(opus));
      flayMap.set(opus, flay);
    }
    flay.addFile(file);
  }
  console.log('flaySource', 'flayMap size', flayMap.size);
}

load();

export default {
  getMap: () => {
    return flayMap;
  },
  list: () => {
    return Array.from(flayMap.values());
  },
  reload: load,
};

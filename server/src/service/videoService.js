import path from 'path';
import { existsSync, readFileSync, writeFile, writeFileSync } from 'fs';
import _ from 'lodash';

import { INFO_PATH } from '../config/flayProperties.js';

const VIDEO = {
  opus: 'NO_OPUS',
  play: 0,
  rank: 0,
  lastAccess: 0,
  comment: null,
  title: null,
  desc: null,
  tags: [],
};

const videoJsonPath = path.resolve(INFO_PATH, 'video.json');
if (!existsSync(videoJsonPath)) {
  writeFileSync(videoJsonPath, '[]');
  console.warn('videoService', 'file is not exists, create it', videoJsonPath);
}

console.log('videoService', 'reading', videoJsonPath);
const rowData = readFileSync(videoJsonPath, 'utf8');
const videoList = JSON.parse(rowData);
console.log('videoService', 'read data', videoList.length);

async function writeJson() {
  const data = JSON.stringify(videoList, null, 2);
  writeFile(videoJsonPath, data, (err) => {
    if (err) throw err;
    console.log('videoService', 'writed', videoJsonPath);
  });
}

export default {
  list: () => {
    return videoList;
  },
  get: (opus) => {
    for (const video of videoList) {
      if (video.opus === opus) {
        return video;
      }
    }
    return VIDEO;
  },
  save: (video) => {
    const mergedVideo = _.merge({}, VIDEO, video);
    let found = false;
    for (let i = 0; i < videoList.length; i++) {
      if (videoList[i].opus === mergedVideo.opus) {
        videoList[i] = mergedVideo;
        found = true;
        console.log('videoService', 'found video', videoList[i]);
        break;
      }
    }
    if (!found) {
      videoList.push(mergedVideo);
      console.log('videoService', 'new video', mergedVideo);
    }
    writeJson();
    return mergedVideo;
  },
  find: (keyword) => {
    return videoList.filter((video) => JSON.stringify(video).indexOf(keyword) > -1);
  },
};

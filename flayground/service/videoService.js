import path from 'path';
import { readFileSync, writeFile } from 'fs';

import { INFO_PATH } from '../flayProperties.js';

const videoJsonPath = path.resolve(INFO_PATH, 'video.json');

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
		return {
			opus: opus,
			play: 0,
			rank: 0,
			lastAccess: 0,
			comment: null,
			title: null,
			desc: null,
			tags: [],
		};
	},
	save: (video) => {
		let found = false;
		for (let i = 0; i < videoList.length; i++) {
			if (videoList[i].opus === video.opus) {
				videoList[i] = video;
				found = true;
				console.log('videoService', 'found video', videoList[i]);
				break;
			}
		}
		if (!found) {
			videoList.push(video);
			console.log('videoService', 'new video', video);
		}
		writeJson();
		return video;
	},
};

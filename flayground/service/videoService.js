const path = require('path');
const fs = require('fs');

const flayProperties = require('../flayProperties');

const videoJsonPath = path.resolve(flayProperties.INFO_PATH, 'video.json');

console.log('videoService', 'reading', videoJsonPath);
const rowData = fs.readFileSync(videoJsonPath, 'utf8');
const videoList = JSON.parse(rowData);
console.log('videoService', 'read data', videoList.length);

function writeJson() {
	const data = JSON.stringify(videoList, null, 2);
	fs.writeFile(videoJsonPath, data, (err) => {
		if (err) throw err;
		console.log('videoService', 'writed', videoJsonPath);
	});
}

module.exports = {
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
	},
};

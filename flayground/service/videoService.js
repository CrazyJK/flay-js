const path = require('path');
const fs = require('fs');

const flayProperties = require('../flayProperties');

const videoJsonPath = path.resolve(flayProperties.INFO_PATH, 'video.json');

console.log('videoService', 'reading', videoJsonPath);
const rowData = fs.readFileSync(videoJsonPath, 'utf8');
const videoList = JSON.parse(rowData);
console.log('videoService', 'read data', videoList.length);

// let videoList = [];
// fs.readFile(videoJsonPath, 'utf8', (err, data) => {
// 	videoList = JSON.parse(data);
// 	console.log('videoService', 'read data', videoList.length);
// });

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
};

const path = require('path');
const process = require('child_process');

const flaySource = require('../source/flaySource');
const videoService = require('./videoService');
const flayProperties = require('../flayProperties');

module.exports = {
	listFiles: () => {
		return flaySource.listFiles();
	},
	getMap: () => {
		return flaySource.getMap();
	},
	list: () => {
		return flaySource.list();
	},
	get: (opus) => {
		return flaySource.getMap().get(opus);
	},
	play: (opus) => {
		const flay = flaySource.getMap().get(opus);
		const file = flay.files.movie[0];
		const moviePath = path.resolve(file.path, file.name);
		// call external command
		console.log('flayService', 'play', flayProperties.PLAYER, moviePath);
		const player = process.spawn(flayProperties.PLAYER, [moviePath]);
		player.on('exist', (code) => {
			console.log('flayService', 'player exited', code);
		});
		// update video
		flay.video.play = flay.video.play + 1;
		flay.video.lastAccess = Date.now();
		videoService.save(flay.video);
	},
};

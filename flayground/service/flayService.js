import { resolve } from 'path';
import { spawn } from 'child_process';
import createError from 'http-errors';

import flaySource from '../source/flaySource.js';
import videoService from './videoService.js';
import { PLAYER } from '../flayProperties.js';

export default {
	listFiles: () => {
		return flaySource.listFiles();
	},
	list: () => {
		return flaySource.list();
	},
	getMap: () => {
		return flaySource.getMap();
	},
	get: (opus) => {
		const flay = flaySource.getMap().get(opus);
		if (flay) {
			return flay;
		} else {
			throw createError(404, 'flay notfound: ' + opus);
		}
		// return flaySource.getMap().get(opus) || Error('notfound');
	},
	play: (opus) => {
		const flay = flaySource.getMap().get(opus);
		const file = flay.files.movie[0];
		const moviePath = resolve(file.path, file.name);
		// call external command
		console.log('flayService', 'play', PLAYER, moviePath);
		const player = spawn(PLAYER, [moviePath]);
		player.on('exist', (code) => {
			console.log('flayService', 'player exited', code);
		});
		// update video
		flay.video.play = flay.video.play + 1;
		flay.video.lastAccess = Date.now();
		videoService.save(flay.video);
	},
};

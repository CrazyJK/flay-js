import { resolve } from 'path';
import { spawn } from 'child_process';
import createError from 'http-errors';

import flaySource from '../source/flaySource';
import videoService from './videoService';
import historyService from './historyService';
import History, { Action } from '../domain/History';
import { PLAYER } from '../flayProperties';

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
	get: (opus: string) => {
		const flay = flaySource.getMap().get(opus);
		if (flay) {
			return flay;
		} else {
			throw createError(404, 'flay notfound: ' + opus);
		}
		// return flaySource.getMap().get(opus) || Error('notfound');
	},
	play: (opus: string) => {
		const flay = flaySource.getMap().get(opus);
		const file = flay.files.movie[0];
		const moviePath = resolve(file.path, file.name);
		// call external command
		console.log('flayService', 'play', PLAYER, moviePath);
		spawn(PLAYER, [moviePath]).on('exist', (code) => {
			console.log('flayService', 'player exited', code);
		});
		// update video
		flay.video.play = flay.video.play + 1;
		flay.video.lastAccess = Date.now();
		videoService.save(flay.video);
		// save history
		historyService.save(new History(new Date(), flay.opus, Action.PLAY, flay.toString()));
		return flay;
	},
};

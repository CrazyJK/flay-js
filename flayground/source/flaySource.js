import Flay from '../domain/Flay.js';
import FileUtils from '../FileUtils.js';
import videoService from '../service/videoService.js';
import actressService from '../service/actressService.js';
import { INSTANCE_PATH } from '../flayProperties.js';

const instanceFolderList = INSTANCE_PATH;

let foundFileList = new Array();
let flayMap = new Map();
let flayList = new Array();

function load() {
	// collecting files
	foundFileList = new Array();
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
		// console.log(namePart);
		const studio = namePart[0];
		const opus = namePart[1];
		const title = namePart[2];
		const actressArray = namePart[3].split(',').map((name) => name.trim());
		const release = namePart[4];

		let flay = flayMap.get(opus);
		if (!flay) {
			flay = new Flay(studio, opus, title, actressArray, release);
			flay.setVideo(videoService.get(opus));
			let favorite = false;
			for (const name of actressArray) {
				const actress = actressService.get(name);
				favorite = favorite || actress.favorite;
			}
			flay.setFavorite(favorite);

			flayMap.set(opus, flay);
		}
		flay.addFile(file);
	}
	console.log('flaySource', 'flayMap size', flayMap.size);

	// make flay Array
	flayList = Array.from(flayMap.values());
	console.log('flaySource', 'flayList length', flayList.length);
}

load();

export default {
	listFiles: () => {
		return foundFileList;
	},
	getMap: () => {
		return flayMap;
	},
	list: () => {
		return flayList;
	},
};

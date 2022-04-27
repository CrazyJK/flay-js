import { resolve } from 'path';
import { appendFile } from 'fs';
import lineReader from 'line-reader';
import { INFO_PATH } from '../flayProperties.js';
import History from '../domain/History.js';

const historyFilePath = resolve(INFO_PATH, 'history.csv');
console.log('historyService', 'reading', historyFilePath);

const histories = [];

lineReader.eachLine(historyFilePath, function (line, last) {
	const arr = line.split(',');
	const [date, opus, action, desc] = [arr[0].trim(), arr[1].trim(), arr[2].trim(), arr.slice(3).join(',').trim()];
	histories.push(new History(date, opus, action, desc));
	if (last) {
		console.debug('historyService histories.length', histories.length);
	}
});

export default {
	find: (keyword) => {
		return histories.filter((history) => history.matchAll(keyword));
	},
	getDate: (date) => {
		return histories.filter((history) => history.matchDate(date));
	},
	getOpus: (opus) => {
		return histories.filter((history) => history.matchOpus(opus));
	},
	getAction: (action) => {
		return histories.filter((history) => history.matchAction(action));
	},
	save: (history) => {
		histories.push(history);
		appendFile(historyFilePath, history.toString(), (error) => {
			if (error) throw error;
			console.log('historyService saved', history.toString());
		});
	},
};

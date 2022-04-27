import { resolve } from 'path';
import { appendFile } from 'fs';
import lineReader from 'line-reader';
import { INFO_PATH } from '../flayProperties';
import History, { Action } from '../domain/History';

const historyFilePath = resolve(INFO_PATH, 'history.csv');
console.log('historyService', 'reading', historyFilePath);

const histories: History[] = [];

lineReader.eachLine(historyFilePath, function (line, last) {
	const arr = line.split(',');
	const [date, opus, action, desc] = [arr[0].trim(), arr[1].trim(), arr[2].trim() as Action, arr.slice(3).join(',').trim()];
	histories.push(new History(date, opus, action, desc));
	if (last) {
		console.debug('historyService histories.length', histories.length);
	}
});

export default {
	find: (keyword: string) => {
		return histories.filter((history) => history.matchAll(keyword));
	},
	getDate: (date: string) => {
		return histories.filter((history) => history.matchDate(date));
	},
	getOpus: (opus: string) => {
		return histories.filter((history) => history.matchOpus(opus));
	},
	getAction: (action: string) => {
		return histories.filter((history) => history.matchAction(action));
	},
	save: (history: History) => {
		histories.push(history);
		appendFile(historyFilePath, history.toString(), (error) => {
			if (error) throw error;
			console.log('historyService saved', history.toString());
		});
	},
};

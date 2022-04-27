import { resolve } from 'path';
import { readFileSync, writeFile } from 'fs';

import { INFO_PATH } from '../flayProperties';
import { Tag } from '../domain/Tag';

const tagJsonPath = resolve(INFO_PATH, 'tag.json');

console.log('tagService', 'reading', tagJsonPath);
const rowData = readFileSync(tagJsonPath, 'utf8');
const tagList: Tag[] = JSON.parse(rowData);
console.log('tagService', 'read data', tagList.length);

function writeJson() {
	const data = JSON.stringify(tagList, null, 2);
	writeFile(tagJsonPath, data, (err) => {
		if (err) throw err;
		console.log('tagService', 'writed', tagJsonPath);
	});
}

export default {
	list: () => {
		return tagList;
	},
	get: (id: number) => {
		for (const tag of tagList) {
			if (tag.id === id) {
				return tag;
			}
		}
		return null;
	},
	save: (tag: Tag) => {
		let found = false;
		for (let i = 0; i < tagList.length; i++) {
			if (tagList[i].id === tag.id) {
				tagList[i] = tag;
				found = true;
				console.log('tagService', 'found tag', tagList[i]);
				break;
			}
		}
		if (!found) {
			// check name
			for (let i = 0; i < tagList.length; i++) {
				if (tagList[i].name === tag.name) {
					throw Error('same tag name ' + tag.name);
				}
			}
			tag.id = Math.max(...tagList.map((tag) => tag.id)) + 1;
			tagList.push(tag);
			console.log('tagService', 'new tag', tag);
		}
		writeJson();
		return tag;
	},
};

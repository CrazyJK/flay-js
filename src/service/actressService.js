import { resolve } from 'path';
import { existsSync, readFileSync, writeFile, writeFileSync } from 'fs';

import { INFO_PATH } from '../config/flayProperties.js';

const actressJsonPath = resolve(INFO_PATH, 'actress.json');
if (!existsSync(actressJsonPath)) {
  writeFileSync(actressJsonPath, '[]');
  console.warn('actressService', 'file is not exists, create it', actressJsonPath);
}

console.log('actressService', 'reading', actressJsonPath);
const rowData = readFileSync(actressJsonPath, 'utf8');
const actressList = JSON.parse(rowData);
console.log('actressService', 'read data', actressList.length);

function writeJson() {
  const data = JSON.stringify(actressList, null, 2);
  writeFile(actressJsonPath, data, (err) => {
    if (err) throw err;
    console.log('actressService', 'writed', actressJsonPath);
  });
}

export default {
  list: () => {
    return actressList;
  },
  get: (name) => {
    for (const actress of actressList) {
      if (actress.name === name) {
        return actress;
      }
    }
    return {
      name: name,
      localName: null,
      birth: null,
      body: null,
      height: 0,
      debut: 0,
      comment: null,
      favorite: false,
      coverSize: 0,
    };
  },
  save: (actress) => {
    let found = false;
    for (let i = 0; i < actressList.length; i++) {
      if (actressList[i].name === actress.name) {
        actressList[i] = actress;
        found = true;
        console.log('actressService', 'found actress', actressList[i]);
        break;
      }
    }
    if (!found) {
      actressList.push(actress);
      console.log('actressService', 'new actress', actress);
    }
    writeJson();
    return actress;
  },
};

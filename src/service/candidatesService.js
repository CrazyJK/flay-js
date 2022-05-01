import fs from 'fs';
import path from 'path';
import flaySource from '../source/flaySource.js';
import { CANDIDATE_PATH, SUBTITLES_PATH, STAGE_PATHs } from '../config/flayProperties.js';
import FileUtils from '../utils/FileUtils.js';

export default {
  find: () => {
    const foundFileList = [];
    for (const folder of [CANDIDATE_PATH, SUBTITLES_PATH]) {
      console.log('candidatesService', 'reading', folder);
      const foundFiles = FileUtils.listFiles(folder);
      foundFileList.push(...foundFiles);
    }
    console.log('candidatesService', 'found files', foundFileList.length);

    const hasCandidatesFlayList = [];
    flaySource.list().forEach((flay) => {
      const found = foundFileList.filter((file) => {
        return file.name.toLowerCase().indexOf(flay.opus.toLowerCase()) > -1 || file.name.toLowerCase().indexOf(flay.opus.replace(/(-|_)/g, '').toLowerCase()) > -1;
      });
      if (found.length > 0) {
        flay.files.candidates = found;
        hasCandidatesFlayList.push(flay);
      }
    });
    console.log('candidatesService', 'fonud flay', hasCandidatesFlayList.length);
    return hasCandidatesFlayList;
  },
  accept: (opus, candidate) => {
    const flay = flaySource.getMap().get(opus);
    console.log('candidatesService', 'flay', opus, candidate, flay);

    let filename = flay.toString();
    if (FileUtils.isMovie(candidate.ext)) {
      filename += flay.files.movie.length > 0 ? flay.files.movie.length + 1 : '';
    } else if (FileUtils.isSubtitles(candidate.ext)) {
      filename += flay.files.subtitles.length > 0 ? flay.files.subtitles.length + 1 : '';
    } else {
      throw Error('unknown extention: ' + candidate.ext + ' of ' + candidate.name);
    }

    const newPath = path.resolve(STAGE_PATHs[0], filename + candidate.ext);
    fs.rename(candidate.filepath, newPath, (err) => {
      if (err) throw err;
      console.log('candidatesService', 'accepted', newPath);
      flay.addFile(new File(newPath));
    });
  },
};

import flaySource from '../source/flaySource.js';
import fs from 'fs';
import path from 'path';
import { ARCHIVE } from '../config/flayProperties.js';
import { DateUtils } from '../../www/lib/common.js';

function execDelete(flay) {
  // cover move to archive
  const yyyymm = DateUtils.format(new Date(), 'yyyy-mm');
  fs.rename(flay.files.cover.path, path.resolve(ARCHIVE, yyyymm, flay.files.cover.name), (err) => {
    if (err) throw err;
    console.log('Rename complete!');
  });
  // subtitles move to archive
  // movie remove
}

export default {
  instance: () => {
    flaySource.list().forEach((flay) => {
      // lower rank delete
      if (flay.video.rank < 0) {
        execDelete(flay);
      }
    });
  },
};

import flaySource from '../source/flaySource.js';
import fs from 'fs';
import path from 'path';
import { ARCHIVE_PATH, STORAGE_PATH } from '../config/flayProperties.js';

function execDelete(flay) {
  const yyyymm = flay.release.substring(0, 7).replace(/./i, '-');
  // cover move to archive
  fs.rename(flay.files.cover.filepath, path.resolve(ARCHIVE_PATH, yyyymm, flay.files.cover.name), (err) => {
    if (err) throw err;
    console.log('Rename Cover file complete!', flay.opus);
  });
  // subtitles move to archive
  flay.files.subtitles.forEach((file) => {
    fs.rename(file.filepath, path.resolve(ARCHIVE_PATH, yyyymm, file.name), (err) => {
      if (err) throw err;
      console.log('Rename Subtitles file complete!', flay.opus);
    });
  });
  // movie remove
  flay.files.movie.forEach((file) => {
    const recycleBin = path.parse(file.filepath).root + 'FLAY_RECYCLE_BIN';
    fs.rename(file.filepath, path.resolve(recycleBin, file.name), (err) => {
      if (err) throw err;
      console.log('Rename Movie file complete!', flay.opus);
    });
  });
}

function assembleFiles(flay) {
  const files = [...flay.files.movide, flay.files.cover, ...flay.files.subtitles];
  const parsedPath = path.parse(files[0].filepath);

  let basedir;
  if (flay.video.rank > 0) {
    // to storage
    basedir = path.resolve(STORAGE_PATH, flay.studio);
  } else if (flay.video.rank === 0) {
    // to stage
    basedir = parsedPath.dir;
  } else {
    // to archive
    basedir = path.parse(ARCHIVE_PATH, flay.release.substring(0, 7)).replace(/./i, '-');
  }

  files.forEach((file) => {
    fs.rename(file.filepath, path.resolve(basedir, file.name), (err) => {
      if (err) throw err;
      console.log('Rename file complete!', basedir, file.name);
    });
  });
}

export default {
  instance: () => {
    flaySource.list().forEach((flay) => {
      // lower rank delete
      if (flay.video.rank < 0) {
        execDelete(flay);
      }
      // lower scoe delete TODO
      // assemble files
      assembleFiles(flay);
    });
    // source reload
    flaySource.reload();
  },
};

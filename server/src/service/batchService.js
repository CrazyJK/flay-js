import flaySource from '../source/flaySource.js';
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { ARCHIVE_PATH, STORAGE_PATH } from '../config/flayProperties.js';

/**
 * Flay 삭제
 * @param {FLay} flay
 */
function execDelete(flay) {
  const archiveBase = path.resolve(ARCHIVE_PATH, flay.release.substring(0, 7).replace(/[.]/i, '-'));
  if (!fs.existsSync(archiveBase)) {
    fs.mkdirSync(archiveBase);
  }

  // cover move to archive
  if (flay.files.cover !== null) {
    const destPath = path.resolve(archiveBase, flay.files.cover.name);
    fse.moveSync(flay.files.cover.filepath, destPath);
    console.log('execDelete cover mv', destPath);
  } else {
    console.error('execDelete cover null', flay);
  }

  // subtitles move to archive
  flay.files.subtitles.forEach((file) => {
    const destPath = path.resolve(archiveBase, file.name);
    fse.moveSync(file.filepath, destPath);
    console.log('execDelete subtitles mv', destPath);
  });

  // movie remove
  flay.files.movie.forEach((file) => {
    const recycleBin = path.resolve(path.parse(file.filepath).root, 'FLAY_RECYCLE_BIN');
    if (!fs.existsSync(recycleBin)) {
      fs.mkdirSync(recycleBin);
    }
    const destPath = path.resolve(recycleBin, file.name);
    fse.moveSync(file.filepath, destPath);
    console.log('execDelete movie mv', destPath);
  });
}

/**
 * Flay 파일 조립
 * @param {Flay} flay
 */
function assembleFiles(flay) {
  const files = [...flay.files.movie, flay.files.cover, ...flay.files.subtitles];

  let basedir;
  if (flay.video.rank > 0) {
    // to storage
    basedir = path.resolve(STORAGE_PATH, flay.studio);
  } else if (flay.video.rank === 0) {
    // to stage
    basedir = path.parse(files[0].filepath).dir;
  } else {
    // to archive
    basedir = path.resolve(ARCHIVE_PATH, flay.release.substring(0, 7).replace(/[.]/i, '-'));
  }
  if (!fs.existsSync(basedir)) {
    fs.mkdirSync(basedir);
  }

  files.forEach((file) => {
    const destPath = path.resolve(basedir, file.name);
    if (file.filepath !== destPath) {
      fse.moveSync(file.filepath, destPath);
      console.log('assembleFiles mv', destPath);
    }
  });
}

export default {
  reload: () => {
    flaySource.reload();
  },
  instance: () => {
    const archivingFlay = [];
    const assemblingFlay = [];
    flaySource.list().forEach((flay) => {
      // lower rank delete
      if (flay.video.rank < 0) {
        archivingFlay.push(flay);
      } else {
        assemblingFlay.push(flay);
      }
    });

    archivingFlay.forEach((flay) => execDelete);

    assemblingFlay.forEach((flay) => assembleFiles);

    // source reload
    flaySource.reload();
  },
};

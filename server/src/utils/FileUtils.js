/**
 * Flay File Utilities
 */
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';

import File from '../domain/File.js';

function listFiles(dirPath, arrayOfFiles) {
  const files = readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const filepath = resolve(dirPath, file);

    if (statSync(filepath).isDirectory()) {
      arrayOfFiles = this.listFiles(filepath, arrayOfFiles);
    } else {
      arrayOfFiles.push(new File(filepath));
    }
  });

  return arrayOfFiles;
}

export default {
  listFiles: listFiles,
  isMovie: (ext) => {
    switch (ext) {
      case '.avi':
      case '.mp4':
      case '.mkv':
      case '.wmv':
      case '.m2ts':
        return true;
      default:
        return false;
    }
  },
  isSubtitles: (ext) => {
    switch (ext) {
      case '.smi':
      case '.ass':
      case '.srt':
        return true;
      default:
        return false;
    }
  },
  isImage: (ext) => {
    switch (ext) {
      case '.jpg':
      case '.webp':
        return true;
      default:
        return false;
    }
  },
};

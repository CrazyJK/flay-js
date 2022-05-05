import { dirname, basename, extname } from 'path';
import { statSync } from 'fs';

export default class File {
  constructor(filepath) {
    const stats = statSync(filepath);

    this.filepath = filepath;
    this.ino = stats.ino;
    this.path = dirname(filepath); // 파일이름을 제외한 디렉토리
    this.name = basename(filepath); // 파일 이름
    this.ext = extname(filepath).toLowerCase(); // .을 포함한 확장자
    this.size = stats.size;
    this.mtime = stats.mtimeMs;
    this.birth = stats.birthtimeMs;
  }
}

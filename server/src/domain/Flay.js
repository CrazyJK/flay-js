import FileUtils from '../utils/FileUtils.js';

export default class Flay {
  constructor(studio, opus, title, actressArray, release) {
    this.studio = studio;
    this.opus = opus;
    this.title = title;
    this.actress = actressArray;
    this.release = release;
    this.files = {
      movie: [],
      cover: null,
      subtitles: [],
      candidates: [],
    };
    this.video = null;
  }

  addFile(file) {
    if (FileUtils.isMovie(file.ext)) {
      this.files.movie.push(file);
    } else if (FileUtils.isImage(file.ext)) {
      this.files.cover = file;
    } else if (FileUtils.isSubtitles(file.ext)) {
      this.files.subtitles.push(file);
    } else {
      throw Error('unknown extention: ' + file.ext + ' of ' + file.name);
    }
  }

  setVideo(video) {
    this.video = video;
  }

  toString() {
    return `[${this.studio}][${this.opus}][${this.title}][${this.actress.join(',')}][${this.release}]`;
  }
}

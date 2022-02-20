module.exports = class Flay {
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
		};
		this.video = null;
		this.favorite = false;
	}

	addFile(file) {
		switch (file.ext) {
			case '.avi':
			case '.mp4':
			case '.mkv':
			case '.wmv':
			case '.m2ts':
				this.files.movie.push(file);
				break;
			case '.jpg':
			case '.webp':
				this.files.cover = file;
				break;
			case '.smi':
			case '.ass':
			case '.srt':
				this.files.subtitles.push(file);
				break;
			default:
				throw Error('unknown extention: ' + file.ext + ' of ' + file.name);
		}
	}

	setVideo(video) {
		this.video = video;
	}

	setFavorite(bool) {
		this.favorite = bool;
	}
};

import File from './File';
import { Video } from './Video';

export default class Flay {
	studio: string;
	opus: string;
	title: string;
	actress: string[];
	release: string;
	files: { movie: File[]; cover: File | null; subtitles: File[] };
	video: Video | null;
	favorite: boolean;

	constructor(studio: string, opus: string, title: string, actressArray: string[], release: string) {
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

	addFile(file: File) {
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

	setVideo(video: Video) {
		this.video = video;
	}

	setFavorite(bool: boolean) {
		this.favorite = bool;
	}

	toString() {
		return `[${this.studio}][${this.opus}][${this.title}][${this.actress.join(',')}][${this.release}]`;
	}
}

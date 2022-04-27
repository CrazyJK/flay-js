import { dirname, basename, extname } from 'path';
import { statSync } from 'fs';

export default class File {
	constructor(filepath) {
		const stats = statSync(filepath);

		this.ino = stats.ino;
		this.path = dirname(filepath);
		this.name = basename(filepath);
		this.ext = extname(filepath).toLowerCase();
		this.size = stats.size;
		this.mtime = stats.mtimeMs;
		this.birth = stats.birthtimeMs;
	}
}

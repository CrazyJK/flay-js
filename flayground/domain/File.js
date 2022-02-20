const path = require('path');
const fs = require('fs');

module.exports = class File {
	constructor(filepath) {
		const stats = fs.statSync(filepath);

		this.ino = stats.ino;
		this.path = path.dirname(filepath);
		this.name = path.basename(filepath);
		this.ext = path.extname(filepath).toLowerCase();
		this.size = stats.size;
		this.mtime = stats.mtimeMs;
		this.birth = stats.birthtimeMs;
	}
};

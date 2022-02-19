const path = require('path');
const fs = require('fs');

module.exports = class File {
	constructor(filepath) {
		const stats = fs.statSync(filepath);

		this.ino = stats.ino;
		this.name = path.basename(filepath);
		this.path = path.dirname(filepath);
		this.size = stats.size;
		this.mtime = stats.mtimeMs;
		this.birth = stats.birthtimeMs;
	}
};

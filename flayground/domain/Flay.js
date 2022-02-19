module.exports = class Flay {
	constructor(studio, opus, title, actressArray, release) {
		this.studio = studio;
		this.opus = opus;
		this.title = title;
		this.actress = actressArray;
		this.release = release;
		this.files = [];
	}

	addFile(file) {
		this.files.push(file);
	}
};

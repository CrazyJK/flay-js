/**
 * Flay File Utilities
 */
const path = require('path');
const fs = require('fs');

const File = require('./domain/File');

module.exports = {
	listFiles: function (dirPath, arrayOfFiles) {
		console.log('reading... ', dirPath);
		files = fs.readdirSync(dirPath);

		arrayOfFiles = arrayOfFiles || [];

		files.forEach((file) => {
			const filepath = path.resolve(dirPath, file);

			if (fs.statSync(filepath).isDirectory()) {
				arrayOfFiles = this.listFiles(filepath, arrayOfFiles);
			} else {
				arrayOfFiles.push(new File(filepath));
			}
		});

		return arrayOfFiles;
	},
};

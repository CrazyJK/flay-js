const path = require('path');
const fs = require('fs');

const FileUtils = {
	listFiles: (dirPath, arrayOfFiles) => {
		console.log('reading... ', dirPath);
		files = fs.readdirSync(dirPath);

		arrayOfFiles = arrayOfFiles || [];

		files.forEach((file) => {
			const filepath = path.resolve(dirPath, file);
			if (fs.statSync(filepath).isDirectory()) {
				arrayOfFiles = FileUtils.listFiles(filepath, arrayOfFiles);
			} else {
				arrayOfFiles.push(filepath);
			}
		});

		return arrayOfFiles;
	},
};

module.exports = FileUtils;

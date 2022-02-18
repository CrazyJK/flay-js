/**
 * Flay File Utilities
 */
const path = require('path');
const fs = require('fs');

class File {
    constructor(filepath) {
        const stats = fs.statSync(filepath);

        this.ino = stats.ino;
        this.name = path.basename(filepath);
        this.path = path.dirname(filepath);
        this.size = stats.size;
        this.mtime = stats.mtimeMs;
        this.birth = stats.birthtimeMs;
    }
}

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

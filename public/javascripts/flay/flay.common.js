/**
 * common utilities
 */

var Random = {
	get: function (start, end) {
		return Math.random() * (end - start) + start;
	},
	getInteger: function (start, end) {
		// start부터 end사이의 random 정수 반환
		return Math.round(this.get(start, end));
	},
	getHex: function (start, end) {
		return this.getInteger(start, end).toString(16);
	},
	getBoolean: function () {
		return this.getInteger(1, 2) === 1;
	},
};

var KB = 1024,
	MB = KB * KB,
	GB = MB * KB,
	TB = GB * KB;
var File = {
	formatSize: function (length, unit, digits) {
		if (unit) {
			if (typeof digits === 'undefined') digits = 1;
			if (unit === 'MB') {
				return (length / MB).toFixed(digits) + ' MB';
			} else if (unit === 'GB') {
				return (length / GB).toFixed(digits) + ' GB';
			} else if (unit === 'TB') {
				return (length / TB).toFixed(digits) + ' TB';
			}
		} else {
			if (length < KB) return length + ' B';
			else if (length < MB) return (length / KB).toFixed(0) + ' kB';
			else if (length < GB) return (length / MB).toFixed(0) + ' <span>MB</span>';
			else if (length < TB) return (length / GB).toFixed(1) + ' <span>GB</span>';
			else return (length / TB).toFixed(2) + ' <span>TB</span>';
		}
	},
	validName: (name) => {
		// \ / : * ? " < > |
		return name.replace(/[\\]/gi, '＼').replace(/[/]/gi, '／').replace(/[:]/gi, '：').replace(/[*]/gi, '＊').replace(/[?]/gi, '？').replace(/["]/gi, '＂').replace(/[<]/gi, '＜').replace(/[>]/gi, '＞').replace(/[|]/gi, '｜');
	},
};

var String = {
	isBlank: function (str) {
		return str === null || str.trim().length === 0;
	},
};

var Tag = {
	indexOf: function (list, tag) {
		for (let i = 0; i < list.length; i++) {
			if (list[i].id === tag.id) {
				return i;
			}
		}
		return -1;
	},
};

var LocalStorageItem = {
	set: function (itemName, itemValue) {
		typeof Storage !== 'undefined' && localStorage.setItem(itemName, itemValue);
	},
	get: function (itemName, notfoundDefault) {
		return typeof Storage !== 'undefined' && (localStorage.getItem(itemName) || notfoundDefault);
	},
	getInteger: function (itemName, notfoundDefault) {
		return parseInt(this.get(itemName, notfoundDefault));
	},
	getBoolean: function (itemName, notfoundDefault) {
		if (notfoundDefault) {
			return this.get(itemName, notfoundDefault.toString()) === 'true';
		} else {
			return this.get(itemName) === 'true';
		}
	},
	split: function (itemName, notfoundDefault, delimiter) {
		return this.get(itemName, notfoundDefault).split(delimiter);
	},
	has: (itemName) => {
		return localStorage.hasOwnProperty(itemName);
	},
	remove: (itemName) => {
		localStorage.removeItem(itemName);
	},
	clear: () => {
		localStorage.clear();
	},
};

var SessionStorageItem = {
	set: function (itemName, itemValue) {
		typeof Storage !== 'undefined' && sessionStorage.setItem(itemName, itemValue);
	},
	get: function (itemName, notfoundDefault) {
		return typeof Storage !== 'undefined' && (sessionStorage.getItem(itemName) || notfoundDefault);
	},
	getInteger: function (itemName, notfoundDefault) {
		return parseInt(this.get(itemName, notfoundDefault));
	},
	getBoolean: function (itemName, notfoundDefault) {
		if (notfoundDefault) {
			return this.get(itemName, notfoundDefault.toString()) === 'true';
		} else {
			return this.get(itemName) === 'true';
		}
	},
	has: (itemName) => {
		return sessionStorage.hasOwnProperty(itemName);
	},
	remove: (itemName) => {
		sessionStorage.removeItem(itemName);
	},
	clear: () => {
		sessionStorage.clear();
	},
};

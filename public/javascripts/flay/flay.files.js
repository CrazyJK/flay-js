/**
 * flay.js
 */

// list display
$.ajax({
	url: '/api/listFiles',
	success: (list) => {
		let totalBytes = 0;
		list.forEach((item) => {
			$('#fileList').append(`<li>
				<span class="name"><a href="#${item.ino}" class="link-dark text-decoration-none">${item.name}</a></span>
				<span class="size">${File.formatSize(item.size)}</span>
				<span class="time">${new Date(item.mtime).toISOString().slice(0, 10).replace(/T/g, ' ')}</span>
				<span class="path">${item.path}</span>
			</li>`);
			totalBytes += item.size;
		});
		$('#totalCount').html(list.length);
		$('#totalBytes').html(File.formatSize(totalBytes));
	},
});

const KB = 1024,
	MB = KB * KB,
	GB = MB * KB,
	TB = GB * KB;
const File = {
	formatSize: function (length, unit, digits) {
		if (unit) {
			if (typeof digits === 'undefined') digits = 1;
			if (unit === 'MB') return (length / MB).toFixed(digits) + ' MB';
			else if (unit === 'GB') return (length / GB).toFixed(digits) + ' GB';
			else if (unit === 'TB') return (length / TB).toFixed(digits) + ' TB';
		} else {
			if (length < KB) return length + ' B';
			else if (length < MB) return (length / KB).toFixed(0) + ' kB';
			else if (length < GB) return (length / MB).toFixed(0) + ' MB';
			else if (length < TB) return (length / GB).toFixed(1) + ' GB';
			else return (length / TB).toFixed(2) + ' TB';
		}
	},
	validName: (name) => {
		// \ / : * ? " < > |
		return name
			.replace(/[\\]/gi, '＼')
			.replace(/[/]/gi, '／')
			.replace(/[:]/gi, '：')
			.replace(/[*]/gi, '＊')
			.replace(/[?]/gi, '？')
			.replace(/["]/gi, '＂')
			.replace(/[<]/gi, '＜')
			.replace(/[>]/gi, '＞')
			.replace(/[|]/gi, '｜');
	},
};

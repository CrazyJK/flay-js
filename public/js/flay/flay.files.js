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

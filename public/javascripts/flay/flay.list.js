/**
 * flayMap.js
 */

// map display
$.ajax({
	url: '/api/flay/list',
	success: (flayList) => {
		console.log(flayList);
		let count = 0;
		$.each(flayList, (index, flay) => {
			$('#flayList').append(`<li>
				<span class="studio">${flay.studio}</span>
				<span class="opus"><a href="javascript: window.open('/api/video/${flay.opus}', 'video-${flay.opus}', 'width=300,height=200')">${flay.opus}</a></span>
				<span class="title"><a href="javascript: window.open('/api/cover/${flay.opus}', 'cover-${flay.opus}', 'width=800,height=538')">${flay.title}</a></span>
				<span class="actress">${flay.actress}</span>
				<span class="release">${flay.release}</span>
			</li>`);
			count++;
		});
		$('#totalCount').html(count);
	},
});

/**
 * flayMap.js
 */

// map display
$.ajax({
	url: '/api/flayMap',
	success: (flayMap) => {
		console.log(flayMap);
		let count = 0;
		$.each(flayMap, (opus, flay) => {
			$('#flayList').append(`<li>
				<span class="studio">${flay.studio}</span>
				<span class="opus">${flay.opus}</span>
				<span class="title">${flay.title}</span>
				<span class="actress">${flay.actress}</span>
				<span class="release">${flay.release}</span>
			</li>`);
			count++;
		});
		$('#totalCount').html(count);
	},
});

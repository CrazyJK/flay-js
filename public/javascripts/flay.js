// fetch('/flay/list')
// 	.then((res) => res.json())
// 	.then((list) => {
// 		console.log('list', list.length);
// 		renderList(list);
// 	});

function renderList(list) {
	list.forEach((item) => {
		$('#flayList').append(`<li>${item}</li>`);
	});
}

$.ajax({
	url: '/flay/list',
	success: (list) => {
		console.log('list', list.length);
		renderList(list);
	},
});

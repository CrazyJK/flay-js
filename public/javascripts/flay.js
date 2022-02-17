fetch('/flayground/list')
	.then((res) => res.json())
	.then((list) => {
		console.log('list', list);
		list.forEach((item) => {
			$('#flayList').append(`<li>${item}</li>`);
		});
	});

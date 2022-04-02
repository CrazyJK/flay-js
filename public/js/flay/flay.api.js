/**
 * ajax flay api
 */

const API = {
	Flay: {
		play: (flay) => {
			console.log('API.Flay.play start', flay.opus);
			$.ajax({
				url: '/api/flay/' + flay.opus + '/play',
				method: 'POST',
				success: () => {
					console.log('API.Flay.play end');
				},
			});
		},
	},
	Video: {
		save: (video) => {
			console.log('API.Video.save start', JSON.stringify(video));
			$.ajax({
				url: '/api/video',
				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(video),
				success: () => {
					console.log('API.Video.save end');
				},
			});
		},
	},
	Actress: {
		save: (actress) => {
			console.log('API.Actress.save start', JSON.stringify(actress));
			$.ajax({
				url: '/api/actress',
				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(actress),
				success: () => {
					console.log('API.Actress.save end');
				},
			});
		},
	},
	Tag: {
		save: (tag) => {
			console.log('API.Tag.save start', JSON.stringify(tag));
			$.ajax({
				url: '/api/tag',
				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(tag),
				success: () => {
					console.log('API.Tag.save end');
				},
			});
		},
	},
};

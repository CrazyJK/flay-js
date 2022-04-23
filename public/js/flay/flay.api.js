/**
 * ajax flay api
 */

const API = {
	Flay: {
		play: (flay, callback) => {
			axios.post('/api/flay/' + flay.opus + '/play').then((response) => {
				if (callback) callback(response);
			});
		},
	},
	Video: {
		save: (video, callback) => {
			axios.post('/api/video', video).then(() => {
				if (callback) callback();
			});
		},
	},
	Actress: {
		save: (actress, callback) => {
			axios.post('/api/actress', actress).then((response) => {
				if (callback) callback(response, actress);
			});
		},
	},
	Tag: {
		save: (tag, callback) => {
			axios
				.post('/api/tag', tag)
				.then((response) => {
					if (callback) callback(response);
				})
				.catch((error) => {
					console.error('API.Tag.sava', error.response.data);
					alert(error.response.data.message);
				});
		},
	},
};

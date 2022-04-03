/**
 * ajax flay api
 */

const API = {
	Flay: {
		play: (flay, callback) => {
			axios.post('/api/flay/' + flay.opus + '/play').then((response) => {
				if (callback) callback(response, flay);
			});
		},
	},
	Video: {
		save: (video, callback) => {
			axios.post('/api/video', video).then((response) => {
				if (callback) callback(response, video);
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
			axios.post('/api/tag', tag).then(() => {
				if (callback) callback(response, tag);
			});
		},
	},
};

/**
 * ajax flay api
 */
import axios from 'axios';

export const API = {
  Flay: {
    play: (flay, callback) => {
      axios
        .post('/api/flay/' + flay.opus + '/play')
        .then((response) => {
          console.log('API.Flay.play', response);
          if (callback) callback(response);
        })
        .catch((error) => {
          console.error('API.Flay.play', error.response.data);
          alert(error.response.data.message);
        });
    },
  },
  Video: {
    save: (video, callback) => {
      axios
        .post('/api/video', video)
        .then((response) => {
          console.log('API.Video.save', response);
          if (callback) callback(response);
        })
        .catch((error) => {
          console.error('API.Video.save', error.response.data);
          alert(error.response.data.message);
        });
    },
  },
  Actress: {
    save: (actress, callback) => {
      axios
        .post('/api/actress', actress)
        .then((response) => {
          console.log('API.Actress.save', response);
          if (callback) callback(response);
        })
        .catch((error) => {
          console.error('API.Actress.sava', error.response.data);
          alert(error.response.data.message);
        });
    },
  },
  Tag: {
    save: (tag, callback) => {
      axios
        .post('/api/tag', tag)
        .then((response) => {
          console.log('API.Tag.save', response);
          if (callback) callback(response);
        })
        .catch((error) => {
          console.error('API.Tag.sava', error.response.data);
          alert(error.response.data.message);
        });
    },
  },
};

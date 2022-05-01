import axios from 'axios';
import $ from 'jquery';

$('#btnBatch').on('click', () => {
  axios.post('/api/batch/instance').then((response) => {
    console.log('batch instance', response.status);
  });
});

$('#btnReload').on('click', () => {
  axios.post('/api/batch/reload').then((response) => {
    console.log('batch reload', response.status);
  });
});

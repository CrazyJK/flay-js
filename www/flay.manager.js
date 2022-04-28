/**
 * flay manager
 */

import $ from 'jquery';
import axios from 'axios';
import { API } from './lib/flay.api.js';
import { StringUtils } from './lib/common.js';
import { flayRow, videoRow, historyRow } from './lib/flay.component.js';
import './css/app/flay.manager.scss';

$('#keyword').on('keyup', (e) => {
  if (e.key === 'Enter') {
    const keyword = $(e.target).val().trim();
    if (StringUtils.isBlank) {
      return;
    }

    Promise.all([axios.get('/api/flay/find/' + keyword), axios.get('/api/video/find/' + keyword), axios.get('/api/history/find/' + keyword)]).then((results) => {
      const [flayList, videoList, historyList] = [results[0].data, results[1].data, results[2].data];
      console.log(`flayList ${flayList.length}, videoList ${videoList.length}, historyList ${historyList.length}`);

      flayList.forEach((flay) => $('#flaySearchResult').append(flayRow(flay)));
      videoList.forEach((video) => $('#videoSearchResult').append(videoRow(video)));
      historyList.forEach((historyy) => $('#historySearchResult').append(historyRow(history)));
    });
  }
});

$('#btnBatch').on('click', () => {
  axios.post('/api/batch/instance').then((response) => {
    console.log('batch instance', response.status);
  });
});

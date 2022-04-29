/**
 * flay manager
 */

import $ from 'jquery';
import axios from 'axios';
import { API } from '../lib/flay.api.js';
import { StringUtils } from '../lib/common.js';
import { flayRow, videoRow, historyRow, actressRow } from '../lib/flay.component.js';
import './flayManager.scss';

$('#keyword').on('keyup', (e) => {
  if (e.key === 'Enter') {
    const keyword = $(e.target).val().trim();
    if (StringUtils.isBlank) {
      return;
    }

    findAll(keyword).then((results) => {
      console.log('findAll resolve', results);
    });
  }
});

$('#btnBatch').on('click', () => {
  axios.post('/api/batch/instance').then((response) => {
    console.log('batch instance', response.status);
  });
});

/* ---- input new flay info ---- */
$('#newOpus, #newTitle, #newActress, #newDesc').on('keyup', (e) => {
  if (e.key !== 'Enter') {
    return;
  }
  // find flay, video, history by #newOpus and get studio
  const opus = $('#newOpus').val();
  if (opus) {
    findAll(opus).then((results) => {
      console.log('findAll resolve', results);
    });
    // guess studio by opus prefix
    const opusPrefix = opus.split('-')[0];
    axios.get('/api/studio/guess/' + opusPrefix).then((response) => {
      if (!StringUtils.isBlank(response.data)) {
        $('#flay-studio').val();
      }
    });
  }

  // find actress by #newActress
  const actressLocalName = $('#newActress').val(); // may be localname
  if (!StringUtils.isBlank(actressLocalName)) {
    axios('/api/actress/localName/' + actressLocalName).then((response) => {
      if (response.data.length === 0) {
        // not found
        $('#actress-name, #actress-localname, #actress-birth, #actress-body, #actress-height, #actress-debut').val('');
      } else if (response.data.length === 1) {
        const actress = response.data;
        $('#actress-favorite').prop('checked', actress.favorite);
        $('#actress-name').val(actress.name);
        $('#actress-localname').val(actress.localName);
        $('#actress-birth').val(actress.birth);
        $('#actress-body').val(actress.body);
        $('#actress-height').val(actress.height);
        $('#actress-debut').val(actress.debut);
      } else {
        // duplicated.
        const $duplicatedActress = $('#duplicatedActress').empty().toggleClass('show');
        response.data.forEach((actress) => {
          $(actressRow(actress))
            .on('click', () => {
              // copy actress info to actress-inputgroup
            })
            .appendTo($duplicatedActress);
        });
      }
    });
  }

  // request translate by #newTitle, #newDesc
  const title = $('#newTitle').val();
  const desc = $('#newDesc').val();
  if (!StringUtils.isBlank(title) || !StringUtils.isBlank(desc)) {
    // call translate page
  }
});

/* ---- copy flay file name ---- */
$('#btnFlayCopy').on('click', () => {
  const flay = $('#flay-inputgroup').serializeObject();
  navigator.clipboard.writeText(`[${flay.studio}][${flay.opus}][${flay.title}][${flay.actress}][${flay.release}]`);
});

/* ---- new actress save ---- */
$('#btnActressSave').on('click', () => {
  if (!StringUtils.isBlank($('#actress-name').val())) {
    const actress = $('#actress-inputgroup').serializeObject();
    actress.favorite = $('#actress-favorite').prop('checked');
    API.Actress.save(actress);
  }
});

/* ---- parse new actress data ---- */
$('#actress-data').on('change', () => {
  alert('need to implementation');
});

async function findAll(keyword) {
  return await Promise.all([axios.get('/api/flay/find/' + keyword), axios.get('/api/video/find/' + keyword), axios.get('/api/history/find/' + keyword)]).then((results) => {
    const [flayList, videoList, historyList] = [results[0].data, results[1].data, results[2].data];
    console.log(`flayList ${flayList.length}, videoList ${videoList.length}, historyList ${historyList.length}`);

    flayList.forEach((flay) => $('#flaySearchResult').append(flayRow(flay)));
    videoList.forEach((video) => $('#videoSearchResult').append(videoRow(video)));
    historyList.forEach((historyy) => $('#historySearchResult').append(historyRow(history)));

    return [flayList, videoList, historyList];
  });
}

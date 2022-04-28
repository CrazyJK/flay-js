/**
 * flayMap.js
 */
import axios from 'axios';
import $ from 'jquery';
import './css/app/flay.list.scss';
import { flayRow } from './lib/flay.component.js';

axios
  .get('/api/flay/list')
  .then((response) => {
    // 성공 핸들링
    const flayList = response.data;
    $('#totalCount').html(flayList.length);
    flayList.forEach((flay) => {
      $('#flayList').append(flayRow(flay));
    });
  })
  .catch((error) => {
    // 에러 핸들링
  })
  .then(() => {
    // 항상 실행되는 영역
  });

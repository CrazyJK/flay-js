/**
 * flayMap.js
 */
import axios from 'axios';
import $ from 'jquery';
import './css/app/flay.list.scss';

axios
  .get('/api/flay/list')
  .then((response) => {
    // 성공 핸들링
    const flayList = response.data;
    let count = 0;
    $.each(flayList, (index, flay) => {
      $('#flayList').append(`<li>
        <span class="studio">${flay.studio}</span>
        <span class="opus"><a href="javascript: window.open('/api/video/${flay.opus}', 'video-${flay.opus}', 'width=300,height=200')">${flay.opus}</a></span>
        <span class="title"><a href="javascript: window.open('/api/cover/${flay.opus}', 'cover-${flay.opus}', 'width=800,height=538')">${flay.title}</a></span>
        <span class="actress">${flay.actress}</span>
        <span class="release">${flay.release}</span>
      </li>`);
      count++;
    });
    $('#totalCount').html(count);
  })
  .catch((error) => {
    // 에러 핸들링
  })
  .then(() => {
    // 항상 실행되는 영역
  });

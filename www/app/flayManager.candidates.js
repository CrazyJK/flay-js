import axios from 'axios';
import $ from 'jquery';
import { FileUtils } from '../lib/common.js';
import { flayRow } from '../lib/flay.component.js';

$('#btnGetCandidates').on('click', () => {
  axios.get('/api/candidates').then((response) => {
    console.log('candidates', response.data);

    const $candidatesList = $('#candidatesList').empty();
    const flayList = response.data;
    if (flayList.length < 1) {
      return;
    }

    for (let flay of flayList) {
      $('<li class="bordered p-2">')
        .append(
          flayRow(flay),
          (() => {
            const candidatesRows = [];
            flay.files.candidates.forEach((file) => {
              candidatesRows.push(
                $(`<div class="candidate">
                  <span>${file.path}</span>
                  <span>${file.name}</span>
                  <span>${FileUtils.formatSize(file.size)}</span>
                </div>`).on('click', (e) => {
                  console.log('accept candidate', e.target, file);
                  axios.put('/api/candidates/' + flay.opus, file).then(() => {
                    console.log('accepted candidate', e.target);
                    if ($(e.target).parents('li').find('.candidate').length === 1) {
                      $(e.target).parents('li').find('img').hide();
                    }
                    $(e.target).parents('.candidate').remove();
                    $(e.target).remove();
                  });
                })
              );
            });
            return candidatesRows;
          })(),
          `<img src=/api/cover/${flay.opus}>`
        )
        .appendTo($candidatesList);
    }
  });
});

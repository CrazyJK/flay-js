import $ from 'jquery';
import axios from 'axios';
import { API } from '../lib/flay.api.js';
import { DateUtils, StringUtils } from '../lib/common.js';
import { flayRow, videoRow, historyRow, actressRow } from '../lib/flay.component.js';

$('#keyword').on('keyup', (e) => {
  if (e.key === 'Enter') {
    const keyword = $(e.target).val().trim();
    if (StringUtils.isBlank(keyword)) {
      return;
    }

    findAll(keyword).then((results) => {
      console.log('findAll resolve', results);
    });
  }
});

/* ---- input new flay info ---- */
$('#newOpus, #newTitle, #newActress, #newDesc').on('keyup', (e) => {
  if (e.key !== 'Enter') {
    return;
  }
  // find flay, video, history by #newOpus and get studio
  const opus = $('#newOpus').val().trim();
  if (opus) {
    findAll(opus).then((results) => {
      console.log('findAll resolve', results);
    });
    // set opus
    $('#flay-opus').val(opus);
    // guess studio by opus prefix
    const opusPrefix = opus.split('-')[0];
    axios.get('/api/studio/guess/' + opusPrefix).then((response) => {
      if (!StringUtils.isBlank(response.data)) {
        $('#flay-studio').val(response.data);
      }
    });
    // search arzon
    const URL_SEARCH_ARZON = 'https://www.arzon.jp/itemlist.html?t=&m=all&s=&q=';
    window.open(URL_SEARCH_ARZON + opus, 'arzonSearch', 'width=1500,height=1400');
  }

  // find actress by #newActress
  const actressLocalName = $('#newActress').val().trim(); // may be localname
  if (!StringUtils.isBlank(actressLocalName)) {
    axios('/api/actress/localName/' + actressLocalName).then((response) => {
      if (response.data.length === 0) {
        // not found
        $('#actress-name, #actress-localname, #actress-birth, #actress-body, #actress-height, #actress-debut').val('');
        $('#actress-localname').val(actressLocalName);
        const URL_SEARCH_ACTRESS = 'https://www.minnano-av.com/search_result.php?search_scope=actress&search=+Go+&search_word=';
        window.open(URL_SEARCH_ACTRESS + encodeURI(actressLocalName), 'actressSearch', 'width=1200,height=950');
      } else if (response.data.length === 1) {
        const actress = response.data[0];
        $('#actress-favorite').prop('checked', actress.favorite);
        $('#actress-name').val(actress.name);
        $('#actress-localname').val(actress.localName);
        $('#actress-birth').val(actress.birth);
        $('#actress-body').val(actress.body);
        $('#actress-height').val(actress.height);
        $('#actress-debut').val(actress.debut);
        // set flay-actress
        const prevActressName = $('#flay-actress').val().trim();
        let actressNames = [actress.name];
        if (prevActressName) {
          actressNames = [...prevActressName.split(','), actress.name];
        }
        $('#flay-actress').val(actressNames.join(','));
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
  const URL_TRANSLATE_PAPAGO = 'https://papago.naver.com/?sk=auto&tk=ko&st=';
  const title = $('#newTitle').val().trim();
  const desc = $('#newDesc').val().trim();
  if (!StringUtils.isBlank(title) || !StringUtils.isBlank(desc)) {
    // call translate page
    window.open(URL_TRANSLATE_PAPAGO + encodeURI(title + ' ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ ' + desc), 'translateByPapago', 'width=1000,height=500');
  }
});

/* ---- copy clipboard flay file name ---- */
$('#btnFlayCopy').on('click', () => {
  const studio = $('#flay-studio').val();
  const opus = $('#flay-opus').val();
  const title = $('#flay-title').val();
  const actress = $('#flay-actress').val();
  const release = $('#flay-release').val();

  if (StringUtils.isBlank(studio) || StringUtils.isBlank(opus) || StringUtils.isBlank(title) || StringUtils.isBlank(release)) {
    return;
  }
  const text = `[${studio}][${opus}][${title}][${actress}][${release}]`;
  console.log('clipboard', text);
  navigator.clipboard.writeText(text).then(() => {
    $('#btnFlayCopy > i').toggleClass('fa-clipboard fa-clipboard-check');
    API.Video.save({
      opus: opus,
      title: $('#newTitle').val().trim(),
      desc: $('#newDesc').val().trim(),
    });
  });
});

/* ---- new actress save ---- */
$('#btnActressSave').on('click', () => {
  if (!StringUtils.isBlank($('#actress-name').val())) {
    const actress = {
      name: $('#actress-name').val().trim(),
      localName: $('#actress-localname').val().trim(),
      birth: $('#actress-birth').val().trim(),
      body: $('#actress-body').val().trim(),
      height: parseInt($('#actress-height').val().trim()),
      debut: parseInt($('#actress-debut').val().trim()),
      favorite: $('#actress-favorite').prop('checked'),
      comment: '',
      coverSize: 0,
    };
    API.Actress.save(actress);
  }
});

/* ---- parse new actress data ---- */
$('#actress-data').on('keyup', (e) => {
  $(e.target)
    .val()
    .split('\n')
    .forEach((line) => {
      // console.log(line);
      if (/[0-9]年/.test(line)) {
        // 1987年09月07日 （現在 34歳）おとめ座
        const birth = line.split(' ')[0];
        $('#actress-birth').val(birth);
      } else if (line.indexOf('T') > -1) {
        // T161 / B83(Eカップ) / W58 / H82 / S
        const splitText = line.split(' / ');
        const height = splitText[0].substring(1);
        const body = splitText[1] + ' / ' + splitText[2] + ' / ' + splitText[3];
        $('#actress-body').val(
          body
            .trim()
            .replace(/^[A-Z]|\(|カップ\)/gi, '')
            .replace(/\/ [A-Z]/gi, '- ')
        );
        $('#actress-height').val(height);
      }
    });
});

/* ---- change flay release info ---- */
$('#flay-release').on('keyup', (e) => {
  const release = e.target.value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
  $(e.target).val(release);
  // check valid
  const DATE_PATTERN = /^(19|20)\d{2}.(0[1-9]|1[012]).(0[1-9]|[12][0-9]|3[0-1])$/;
  const isValid = DATE_PATTERN.test(release);
  $(e.target).toggleClass('input-invalid', !isValid);
  if (isValid) {
    $(e.target).toggleClass('input-warning', !release.startsWith(DateUtils.format(new Date(), 'yyyy')));
  } else {
    $(e.target).removeClass('input-warning');
  }
});

/* ---- clear input form ---- */
$('#btnClear').on('dblclick', () => {
  $('#newFlayIncome input').val('');
  $('#newFlayIncome textarea').val('');
  $('#newFlayIncome input[type="checkbox"]').prop('checked', false);
  $('#searchResult').removeClass('show');
});

async function findAll(keyword) {
  return await Promise.all([axios.get('/api/flay/find/' + keyword), axios.get('/api/video/find/' + keyword), axios.get('/api/history/find/' + keyword)]).then((results) => {
    const [flayList, videoList, historyList] = [results[0].data, results[1].data, results[2].data];
    console.log(`flayList ${flayList.length}, videoList ${videoList.length}, historyList ${historyList.length}`);

    $('#flaySearchResult, #videoSearchResult, #historySearchResult').empty();
    flayList.forEach((flay) => $('#flaySearchResult').append(flayRow(flay)));
    videoList.forEach((video) => $('#videoSearchResult').append(videoRow(video)));
    historyList.forEach((history) => $('#historySearchResult').append(historyRow(history)));

    $('#searchResult').addClass('show');
    return [flayList, videoList, historyList];
  });
}

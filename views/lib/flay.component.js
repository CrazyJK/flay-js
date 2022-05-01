import $ from 'jquery';
import _ from 'lodash';
import { DateUtils } from './common.js';

/**
 * div로 둘러싼 flay 기본 내용
 * @param {Flay} flay
 * @returns
 */
export const flayRow = (flay) => {
  return `<div class="flay-row">
        <span class="studio">${flay.studio}</span>
        <span class="opus"><a href="javascript: window.open('/api/flay/${flay.opus}', 'video-${flay.opus}', 'width=300,height=200')">${flay.opus}</a></span>
        <span class="title"><a href="javascript: window.open('/api/cover/${flay.opus}', 'cover-${flay.opus}', 'width=800,height=538')">${flay.title}</a></span>
        <span class="actress">${flay.actress}</span>
        <span class="release">${flay.release}</span>
      </div>`;
};

/**
 * div로 둘러싼 video 기본 내용
 * @param {video} video
 * @returns
 */
export const videoRow = (video) => {
  return `<div class="video-row">
      <span class="opus">${video.opus}</span>
      <span class="rank">${video.rank} <small>rank</small></span>
      <span class="play">${video.play} <small>play</small></span>
      <span class="last">${DateUtils.format(video.lastAccess, 'yyyy-mm-dd hh:mi')}</span>
      <span class="tags">${video.tags.map((tag) => tag.name).join(', ')}</span>
    </div>`;
};

/**
 * div로 둘러싼 history 내용
 * @param {history} history
 * @returns
 */
export const historyRow = (history) => {
  return `<div class="history-row">
      <span class="opus">${history.opus}</span>
      <span class="date">${history.date}</span>
      <span class="action">${history.action}</span>
    </div>`;
};

/**
 * div로 둘러싼 actress 내용
 * @param {actress} actress
 * @returns
 */
export const actressRow = (actress) => {
  return `<div>
      <span class="actress-favorite" >${actress.favorite}</span>
      <span class="actress-name"     >${actress.name}</span>
      <span class="actress-localname">${actress.localName}</span>
      <span class="actress-birth"    >${actress.birth}</span>
      <span class="actress-body"     >${actress.body}</span>
      <span class="actress-height"   >${actress.height}</span>
      <span class="actress-debut"    >${actress.debut}</span>
    <div>`;
};

export const flayCard = (flay, options) => {
  const opts = {
    excludes: [],
  };
  _.extend(opts, options);

  const $studio = $('<div>').html(`<label class="flay-studio">${flay.studio}</label>`);
  const $title = $('<div>').html(`<label class="flay-title">${flay.title}</label>`);
  const $opus_rank = $('<div>').append(`<label class="flay-opus">${flay.opus}</label>`, `<label class="flay-rank mx-2 px-2">${flay.video.rank}</label>`);
  const $actress = $('<div>', { class: 'flay-actress-wrap' }).append(
    (() => {
      const a = [];
      flay.actress.forEach((name) => {
        a.push(
          $(`<label class="flay-actress mr-2">${name}</label>`).on('click', (e) => {
            console.log('actress click', name);
            window.open('/flay/actress/' + name, name, 'width=1050,height=1200');
          })
        );
      });
      return a;
    })()
  );
  const $tag = $('<div>', { class: 'flay-tag-wrap' }).html(flay.video.tags.map((t) => `<small class="flay-tag mx-1">${t.name}</small>`));
  const $files = $('<div>', { class: 'flay-files-wrap' }).append(
    $('<label>', { class: 'flay-files ' + (flay.files.movie.length > 0 ? '' : 'no-movie') })
      .html('Mov')
      .on('click', () => {
        console.log('movie click', flay.opus);
      }),
    $('<label>', { class: 'flay-files mx-2 ' + (flay.files.subtitles.length > 0 ? '' : 'no-subtitles') }).html('Sub')
  );

  const $card = $('<div>', { class: 'box-shadow flay-card' }).css({
    backgroundImage: `url(/api/cover/${flay.opus})`,
  });
  $card.append($title);
  $card.append($opus_rank);
  if (!opts.excludes.includes('studio')) {
    $card.append($studio);
  }
  if (!opts.excludes.includes('actress')) {
    $card.append($actress);
  }
  $card.append($files);
  $card.append($tag);

  return $card;
};

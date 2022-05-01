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

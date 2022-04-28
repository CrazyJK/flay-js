import { DateUtils } from './common.js';

export default {
  flayRow: (flay) => {
    return `<li class="flay-row">
        <span class="studio">${flay.studio}</span>
        <span class="opus"><a href="javascript: window.open('/api/video/${flay.opus}', 'video-${flay.opus}', 'width=300,height=200')">${flay.opus}</a></span>
        <span class="title"><a href="javascript: window.open('/api/cover/${flay.opus}', 'cover-${flay.opus}', 'width=800,height=538')">${flay.title}</a></span>
        <span class="actress">${flay.actress}</span>
        <span class="release">${flay.release}</span>
      </li>`;
  },
  videoRow: (video) => {
    return `<li class="video-row">
      <span class="opus">${video.opus}</span>
      <span class="rank">${video.rank}</span>
      <span class="play">${video.play}</span>
      <span class="last">${video.lastAccess}</span>
      <span class="tags">${video.tags.map((tag) => tag.name).join(', ')}</span>
    </li>`;
  },
  historyRow: (history) => {
    return `<li class="history-row">
      <span class="opus">${history.opus}</span>
      <span class="action">${history.action}</span>
      <span class="date">${DateUtils.format(history.date, 'yyyy-mm-dd hh:mi')}</span>
    </li>`;
  },
};

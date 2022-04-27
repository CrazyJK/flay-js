/**
 * flay.home.js
 */
import axios from 'axios';
import $ from 'jquery';
import { API } from './lib/flay.api.js';
import dominatedColor from './lib/dominated.color.js';
import { DateUtils, FileUtils, StringUtils, Random, FlayFiles, Tag, LocalStorageItem } from './lib/common.js';

let flayMap = new Map();
let actressMap = new Map();
let tagMap = new Map();

let filteredOpus = [];
let currentOpusIndex = 0;
let currentFlay;

let isLoading = false;

Promise.all([axios.get('/api/flay/list'), axios.get('/api/actress'), axios.get('/api/tag')]).then((results) => {
  flayMap = results[0].data.reduce((map, flay) => {
    map.set(flay.opus, flay);
    return map;
  }, new Map());

  actressMap = results[1].data.reduce((map, actress) => {
    map.set(actress.name, actress);
    return map;
  }, new Map());

  tagMap = results[2].data.reduce((map, tag) => {
    map.set(tag.id, tag);
    return map;
  }, new Map());

  initCondition();
  renderTagList();
  addEventListener();
  filterFlay();
});

function initCondition() {
  const movie = LocalStorageItem.getBoolean('flay.home.cond.movie', true);
  const subti = LocalStorageItem.getBoolean('flay.home.cond.subtitles', false);
  const favor = LocalStorageItem.getBoolean('flay.home.cond.favorite', true);
  const nofav = LocalStorageItem.getBoolean('flay.home.cond.nofavorite', true);
  const ranks = LocalStorageItem.split('flay.home.cond.lanks', '0', ',');
  const sort = LocalStorageItem.get('flay.home.cond.sort');

  $('#movie').prop('checked', movie);
  $('#subtitles').prop('checked', subti);
  $('#favorite').prop('checked', favor);
  $('#nofavorite').prop('checked', nofav);
  ranks.forEach((rank) => {
    $('input[name="rank"][value="' + rank + '"]').prop('checked', true);
  });
  $('input[name="sort"][value="' + sort + '"]').prop('checked', true);
}

function filterFlay() {
  // filter
  const searchKeyword = $('#searchKeyword').val().trim();
  const movie = $('#movie').prop('checked');
  const subtitles = $('#subtitles').prop('checked');
  const favorite = $('#favorite').prop('checked');
  const nofavorite = $('#nofavorite').prop('checked');
  // const ranks = $('input[name="rank"]:checked')
  // 	.serialize()
  // 	.replace(/rank=/gi, '')
  // 	.split('&')
  // 	.map((r) => Number(r));
  const ranks = $('input[name="rank"]:checked')
    .serializeArray()
    .map((r) => Number(r.value));
  const sort = $('input[name="sort"]:checked').val();

  LocalStorageItem.set('flay.home.cond.movie', movie);
  LocalStorageItem.set('flay.home.cond.subtitles', subtitles);
  LocalStorageItem.set('flay.home.cond.favorite', favorite);
  LocalStorageItem.set('flay.home.cond.nofavorite', nofavorite);
  LocalStorageItem.set('flay.home.cond.lanks', ranks);
  LocalStorageItem.set('flay.home.cond.sort', sort);

  filteredOpus = [];
  [...flayMap.values()].forEach((flay) => {
    // rank
    if (!ranks.includes(flay.video.rank)) {
      return false;
    }
    // movie
    if (movie && flay.files.movie.length === 0) {
      return false;
    }
    // subtitles
    if (subtitles && flay.files.subtitles.length === 0) {
      return false;
    }
    // favorite
    if (favorite && nofavorite) {
      // all
    } else if (favorite && !nofavorite) {
      if (!flay.favorite) {
        return false;
      }
    } else if (!favorite && nofavorite) {
      if (flay.favorite) {
        return false;
      }
    } else if (!favorite && !nofavorite) {
      return false;
    }
    // keyword
    if (searchKeyword.length > 0) {
      const fullname = `${flay.studio} ${flay.opus} ${flay.title} ${flay.actress} ${flay.release}`;
      if (fullname.indexOf(searchKeyword) < 0) {
        return false;
      }
    }
    filteredOpus.push(flay.opus);
  });

  filteredOpus.sort((o1, o2) => {
    const [f1, f2] = [flayMap.get(o1), flayMap.get(o2)];
    switch (sort) {
      case 'r':
        return f1.release.localeCompare(f2.release);
      case 'm':
        return FlayFiles.lastModified(f1) - FlayFiles.lastModified(f2);
      case 'a':
        return f1.video.lastAccess - f2.video.lastAccess;
      default:
        break;
    }
  });

  // go random page
  if (filteredOpus.length > 0) {
    goPage(Random.getInteger(0, filteredOpus.length - 1));
  }
  $('.container-flay, .fixed-bottom').css({
    opacity: filteredOpus.length > 0 ? 1 : 0,
  });
}

function goPage(selectedIndex) {
  if (selectedIndex < 0 || selectedIndex >= filteredOpus.length) {
    return;
  }
  currentOpusIndex = selectedIndex;
  currentFlay = flayMap.get(filteredOpus[currentOpusIndex]);

  isLoading = true;

  // render pagination
  renderPagination();

  // show current flay
  showCover();
  showActress();
}

function renderPagination() {
  const finalPageIndex = filteredOpus.length;
  const startPageIndex = Math.max(0, currentOpusIndex - 5);
  const endPageIndex = Math.min(currentOpusIndex + 6, finalPageIndex);
  $('.pagination').empty();
  // if not first
  if (startPageIndex > 0) {
    $('.pagination').append(`
			<li class="page-item">
				<a class="page-link" href="javascript: goPage(0)">1</a>
			</li>
		`);
  }
  for (let i = startPageIndex; i < endPageIndex; i++) {
    $('.pagination').append(`
			<li class="page-item ${currentOpusIndex === i ? 'active' : ''}">
				<a class="page-link" href="javascript: goPage(${i})">${i + 1}</a>
			</li>
		`);
  }
  // if not last
  if (endPageIndex < finalPageIndex) {
    $('.pagination').append(`
			<li class="page-item">
				<a class="page-link" href="javascript: goPage(${finalPageIndex - 1})">${finalPageIndex}</a>
			</li>
		`);
  }
  // page progress bar
  const pagePercent = ((currentOpusIndex + 1) / filteredOpus.length) * 100;
  $('.page-bar')
    .attr('aria-valuenow', pagePercent)
    .css('width', pagePercent + '%');
}

function showCover() {
  currentFlay = flayMap.get(filteredOpus[currentOpusIndex]);
  console.log('showCover', currentFlay.opus);

  axios({
    method: 'get',
    url: '/api/cover/' + currentFlay.opus,
    responseType: 'blob',
  }).then(function (response) {
    const coverObjectURL = URL.createObjectURL(response.data);

    $('.container-flay .flay .flay-cover').css({
      backgroundImage: 'url(' + coverObjectURL + ')',
    });

    dominatedColor(coverObjectURL).then((colors) => {
      $('.container-flay .flay .flay-info-cover').css({
        boxShadow: `inset 0 0 1rem 0.5rem rgba(${colors[0].rgba[0]}, ${colors[0].rgba[1]}, ${colors[0].rgba[2]}, ${colors[0].rgba[3]})`,
      });
      $('.container-flay .flay .flay-cover').css({
        boxShadow: `inset 0 0 4rem 2rem rgba(${colors[1].rgba[0]}, ${colors[1].rgba[1]}, ${colors[1].rgba[2]}, ${colors[1].rgba[3]})`,
      });

      showFlay();

      isLoading = false;
    });
  });
}

function showFlay() {
  currentFlay = flayMap.get(filteredOpus[currentOpusIndex]);
  console.log('showFlay', currentFlay.opus);

  $('.container-flay .flay .flay-studio  ').html(currentFlay.studio);
  $('.container-flay .flay .flay-opus    ').html(currentFlay.opus);
  $('.container-flay .flay .flay-release ').html(currentFlay.release);
  $('.container-flay .flay .flay-modified').html(DateUtils.format(FlayFiles.lastModified(currentFlay), 'yy.mm.dd'));
  $('.container-flay .flay .flay-access  ').html(currentFlay.video.lastAccess > 0 ? DateUtils.format(currentFlay.video.lastAccess, 'yy.mm.dd') : '--.--.--');
  $('.container-flay .flay .flay-title   ').html(currentFlay.title);
  $('.container-flay .flay .flay-comment ')
    .toggleClass('comment-empty', StringUtils.isBlank(currentFlay.video.comment))
    .html(StringUtils.isBlank(currentFlay.video.comment) ? 'Comment' : currentFlay.video.comment)
    .show();
  $('.container-flay .flay .flay-comment-input').hide();
  $('.container-flay .flay .flay-info-rank input#flay-rank' + currentFlay.video.rank).prop('checked', true);
  $('.container-flay .flay .flay-movie').html(
    (function () {
      let html = currentFlay.files.movie.length > 1 ? currentFlay.files.movie.length + 'V ' : '';
      let sumSize = 0;
      for (const file of currentFlay.files.movie) {
        sumSize += file.size;
      }
      return html + FileUtils.formatSize(sumSize);
    })()
  );
  $('.container-flay .flay .flay-subtitles')
    .html(
      (function () {
        if (currentFlay.files.subtitles.length === 0) {
          return 'noS';
        } else if (currentFlay.files.subtitles.length === 1) {
          return 'Sub';
        } else {
          return currentFlay.files.subtitles.length + ' Sub';
        }
      })()
    )
    .toggleClass('subtitles-empty', currentFlay.files.subtitles.length === 0);
  $('.container-flay .flay .flay-score').hide();
  $('.container-flay .flay .flay-played')
    .html(currentFlay.video.play + 'p')
    .toggle(currentFlay.video.play > 0);
  // tag toggle
  $('.flay-info-tag input:checkbox').prop('checked', false);
  for (const tag of currentFlay.video.tags) {
    $('.flay-info-tag .flay-tag #tag' + tag.id).prop('checked', true);
  }
  // history
  axios('/api/history/opus/' + currentFlay.opus).then((response) => {
    console.log('histories', response.data);
    response.data
      .filter((history) => history.action === 'PLAY')
      .forEach((history) => {
        console.log(history.date, history.opus, history.action);
        $('.flay-info-history').append(`<small>${history.date.substring(0, 10).replace(/-/g, '&nbsp;&nbsp;')}</small>`);
      });
  });
}

function showActress() {
  console.log('showActress', currentFlay.actress);

  $('.container-flay .flay .flay-info-actress').empty();
  for (const actressName of currentFlay.actress) {
    if (StringUtils.isBlank(actressName)) {
      break;
    }
    let actress = actressMap.get(actressName);
    if (!actress) {
      actress = { name: actressName };
    }
    $(`<div class="flay-actress">
			<label class="flay-actress-favorite">
				<input type="checkbox" name="actressFavorite" class="sr-only" ${actress.favorite ? 'checked' : ''}>
				<span><i class="fa${actress.favorite ? '' : 'r'} fa-heart"></i></span>
			</label>
			<label class="flay-actress-name"     >${actress.name}</label>
			<label class="flay-actress-localName">${actress.localName || ''}</label>
			<label class="flay-actress-age"      >${(function (year) {
        if (year === 0) return '';
        const age = new Date().getFullYear() - year + 1;
        return age + '<small>y</small>';
      })(Number((actress.birth || '').substring(0, 4)))}</label>
			<label class="flay-actress-birth"    >${(actress.birth || '').replace(/年|月|日/g, (match, offset, string) => '<small>' + match + '</small>')}</label>
			<label class="flay-actress-body"     >${(actress.body || '').replace(/ - /g, (match) => '<small>' + match.trim() + '</small>')}</label>
			<label class="flay-actress-height"   >${actress.height || '' ? actress.height + '<small>cm</small>' : ''}</label>
			<label class="flay-actress-debut"    >${actress.debut || '' ? actress.debut + '<small>d</small>' : ''}</label>
		</div>`)
      .data('actress', actress)
      .appendTo($('.container-flay .flay .flay-info-actress'));
  }
}

function renderTagList() {
  console.log('renderTagList');
  $('.flay-info-tag .flay-tag').remove();
  [...tagMap.values()]
    .sort((t1, t2) => t2.name.localeCompare(t1.name))
    .forEach((tag) => {
      $(`	<label class="flay-tag">
					<input type="checkbox" id="tag${tag.id}" value="${tag.id}" class="sr-only">
					<span title="${tag.description}">${tag.name}</span>
				</label>`)
        .data('tag', tag)
        .prependTo($('.flay-info-tag'));
    });
  $('.flay-info-tag-new').hide().find('input').val('');
}

function addEventListener() {
  // ==== filter event
  $('#searchKeyword').on('keyup', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') filterFlay();
  });
  $('.flay-navbar input[type="checkbox"], .flay-navbar input[type="radio"]').on('change', filterFlay);

  // ==== flay event
  // comment change
  $('.container-flay .flay .flay-comment').on('click', () => {
    $('.container-flay .flay .flay-comment').hide();
    $('.container-flay .flay .flay-comment-input').val($('.container-flay .flay .flay-comment').text()).show().focus();
  });
  // comment save
  $('.container-flay .flay .flay-comment-input').on('keyup', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      let commentText = $('.container-flay .flay .flay-comment-input').val().trim();
      if (!StringUtils.isBlank(commentText)) {
        currentFlay.video.comment = commentText;
        $('.container-flay .flay .flay-comment').html(commentText);
        API.Video.save(currentFlay.video);
      }
      // $('.container-flay .flay .flay-comment').show().toggleClass('comment-empty', StringUtils.isBlank(commentText));
      // $('.container-flay .flay .flay-comment-input').hide();
    }
  });
  // actress favorite
  $('.flay-info-actress').on('change', 'input[name="actressFavorite"]', (e) => {
    const actress = $(e.target).closest('.flay-actress').data('actress');
    actress.favorite = $(e.target).prop('checked');
    API.Actress.save(actress);
  });
  // rank change
  $('.flay-rank input').on('change', (e) => {
    currentFlay.video.rank = Number($(e.target).val());
    API.Video.save(currentFlay.video);
  });
  // play click
  $('.flay-movie').on('click', () => {
    API.Flay.play(currentFlay);
  });
  // tag click
  $('.flay-info-tag').on('change', 'input:checkbox', (e) => {
    const tagChecked = $(e.target).prop('checked');
    const tag = $(e.target).closest('.flay-tag').data('tag');
    if (tagChecked) {
      currentFlay.video.tags.push(tag);
    } else {
      const tagIndex = Tag.indexOf(currentFlay.video.tags, tag);
      currentFlay.video.tags.splice(tagIndex, 1);
    }
    API.Video.save(currentFlay.video);
  });
  // opus click
  $('.flay-opus').on('click', (e) => {
    window.open('/api/flay/' + currentFlay.opus, 'video-' + currentFlay.opus, 'width=1000,height=800');
  });
  // create new tag
  $('.flay-info-tag-new input').on('keyup', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      const newTag = $('.flay-info-tag-new input').serializeObject();
      if (newTag.tagName) {
        const tag = {
          id: 0,
          name: newTag.tagName,
          description: newTag.tagDesc,
        };
        API.Tag.save(tag, (response) => {
          currentFlay.video.tags.push(response.data);
          API.Video.save(currentFlay.video);
        });
      }
    }
  });

  // ==== pagination: wheel, key
  $(document).on('wheel keyup', (e) => {
    e.stopPropagation();

    if (isLoading) {
      return;
    }

    if (e.type === 'wheel' && $(e.target).parents('main').length === 0) {
      return;
    }

    const eventCode = e.keyCode || e.originalEvent.wheelDelta;
    console.debug('pagination event', eventCode, e.key);
    switch (eventCode) {
      case 32: // space -> random
        goPage(Random.getInteger(0, filteredOpus.length - 1));
        break;
      case 37: // left key -> previous
      case 120: // wheel up
        goPage(currentOpusIndex - 1);
        break;
      case 39: // right key -> next
      case -120: // wheel down
        goPage(currentOpusIndex + 1);
        break;
      case 33: // page Up -> prev 10
        goPage(Math.max(currentOpusIndex - 10, 0));
        break;
      case 34: // page Down -> next 10
        goPage(Math.min(currentOpusIndex + 10, filteredOpus.length - 1));
        break;
      case 36: // Home -> 1
        goPage(0);
        break;
      case 35: // End -> last
        goPage(filteredOpus.length - 1);
        break;
      default:
        break;
    }
  });
}

/* broadcast receiver */
export const flayBroadcastReceiver = (flay) => {
  flayMap.set(flay.opus, flay);
  if (currentFlay.opus === flay.opus) {
    showFlay();
  }
};
export const actressBroadcastReceiver = (actress) => {
  actressMap.set(actress.name, actress);
  if (currentFlay.actress.includes(actress.name)) {
    showActress();
  }
};
export const tagBroadcastReceiver = (tag) => {
  tagMap.set(tag.id, tag);
  renderTagList();
};

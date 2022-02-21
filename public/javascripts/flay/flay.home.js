/**
 * flayHome.js
 */

let totalFlayList = [];
let filteredFlayList = new Array();
let currentFlayIndex = 0;
let currentFlay = null;
let tagList = [];

$.ajax({
	url: '/api/flay/list',
	success: (list) => {
		totalFlayList = list;
		console.log('list.length', totalFlayList.length);

		addEventListener();

		filterFlay();
	},
});

$.ajax({
	url: '/api/tag',
	success: (list) => {
		tagList = list;

		renderTagList();
	},
});

function filterFlay() {
	// filter
	const searchKeyword = $('#searchKeyword').val().trim();
	const movie = $('#movie').prop('checked');
	const subtitles = $('#subtitles').prop('checked');
	const favorite = $('#favorite').prop('checked');
	const nofavorite = $('#nofavorite').prop('checked');
	const rank0 = $('#rank0').prop('checked');
	const rank1 = $('#rank1').prop('checked');
	const rank2 = $('#rank2').prop('checked');
	const rank3 = $('#rank3').prop('checked');
	const rank4 = $('#rank4').prop('checked');
	const rank5 = $('#rank5').prop('checked');
	const ranks = $('input[name="rank"]:checked')
		.serialize()
		.replace(/rank=/gi, '')
		.split('&')
		.map((r) => Number(r));
	console.log(`condition keyword=[${searchKeyword}] mov=${movie} sub=${subtitles} fav=${favorite} nof=${nofavorite} rank=${ranks} rank0=${rank0} r1=${rank1} r2=${rank2} r3=${rank3} r4=${rank4} r5=${rank5}`);

	filteredFlayList = new Array();
	totalFlayList.forEach((flay) => {
		// rank
		if (ranks.indexOf(flay.video.rank) < 0) {
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
		filteredFlayList.push(flay);
	});
	console.log('filteredList', filteredFlayList.length);

	// go random page
	goPage(Random.getInteger(0, filteredFlayList.length - 1));
}

function goPage(selectedIndex) {
	console.log('goPage selectedIndex', selectedIndex);
	if (selectedIndex < 0 || selectedIndex >= filteredFlayList.length) {
		return;
	}
	currentFlayIndex = selectedIndex;

	// render pagination
	renderPagination();

	// show current flay
	showFlay();
}

function renderPagination() {
	const finalPageIndex = filteredFlayList.length;
	const startPageIndex = Math.max(0, currentFlayIndex - 5);
	const endPageIndex = Math.min(currentFlayIndex + 6, finalPageIndex);
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
			<li class="page-item ${currentFlayIndex === i ? 'active' : ''}">
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
	const pagePercent = ((currentFlayIndex + 1) / filteredFlayList.length) * 100;
	$('.page-bar')
		.attr('aria-valuenow', pagePercent)
		.css('width', pagePercent + '%');
}

function showFlay() {
	currentFlay = filteredFlayList[currentFlayIndex];
	console.log('currentFlay', currentFlay);

	$('.container-flay .flay .flay-cover').css({
		backgroundImage: 'url(/api/cover/' + currentFlay.opus + ')',
	});
	$('.container-flay .flay .flay-studio ').html(currentFlay.studio);
	$('.container-flay .flay .flay-opus   ').html(currentFlay.opus);
	$('.container-flay .flay .flay-release').html(currentFlay.release);
	$('.container-flay .flay .flay-title  ').html(currentFlay.title);
	$('.container-flay .flay .flay-comment')
		.toggleClass('comment-empty', String.isBlank(currentFlay.video.comment))
		.html(String.isBlank(currentFlay.video.comment) ? 'Comment' : currentFlay.video.comment)
		.show();
	$('.container-flay .flay .flay-comment-input').hide();
	$('.container-flay .flay .flay-info-actress').empty();
	for (const actressName of currentFlay.actress) {
		if (String.isBlank(actressName)) {
			break;
		}
		$.ajax({
			url: '/api/actress/' + actressName,
			success: (actress) => {
				$(`<div class="flay-actress">
						<label class="flay-actress-favorite">
							<input type="checkbox" name="actressFavorite" class="sr-only" ${actress.favorite ? 'checked' : ''}>
							<span><i class="fa fa-heart${actress.favorite ? '' : '-o'}"></i></span>
						</label>
						<label class="flay-actress-name"     >${actress.name}</label>
						<label class="flay-actress-localName">${actress.localName}</label>
						<label class="flay-actress-birth"    >${actress.birth}</label>
						<label class="flay-actress-body"     >${actress.body}</label>
						<label class="flay-actress-height"   >${actress.height}</label>
						<label class="flay-actress-debut"    >${actress.debut}</label>
					</div>`)
					.data('actress', actress)
					.appendTo($('.container-flay .flay .flay-info-actress'));
			},
		});
	}
	$('.container-flay .flay .flay-info-rank input#flay-rank' + currentFlay.video.rank).prop('checked', true);
	$('.container-flay .flay .flay-movie').html(
		(function () {
			let html = currentFlay.files.movie.length > 1 ? currentFlay.files.movie.length + 'V ' : '';
			let sumSize = 0;
			for (const file of currentFlay.files.movie) {
				sumSize += file.size;
			}
			return html + File.formatSize(sumSize);
		})(),
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
			})(),
		)
		.toggleClass('subtitles-empty', currentFlay.files.subtitles.length === 0);
	$('.container-flay .flay .flay-score').hide();
	$('.container-flay .flay .flay-played')
		.html(currentFlay.video.play + 'p')
		.toggle(currentFlay.video.play > 0);
	// tag toggle
	$('.flay-info-tag input:checkbox').prop('checked', false);
	console.log('tag length', currentFlay.video.tags.length);
	for (const tag of currentFlay.video.tags) {
		$('.flay-info-tag .flay-tag #tag' + tag.id).prop('checked', true);
	}
}

function renderTagList() {
	$('.flay-info-tag').empty();
	tagList
		.sort((t1, t2) => t1.name.localeCompare(t2.name))
		.forEach((tag) => {
			$(`	<label class="flay-tag">
					<input type="checkbox" id="tag${tag.id}" value="${tag.id}" class="sr-only">
					<span title="${tag.description}">${tag.name}</span>
				</label>`)
				.data('tag', tag)
				.appendTo($('.flay-info-tag'));
		});
}

// eventListener
function addEventListener() {
	// ==== filter event
	$('#searchKeyword').on('keyup', (e) => {
		if (e.keyCode === 13) {
			filterFlay();
		}
	});
	$('.flay-navbar input[type="checkbox"]').on('change', filterFlay);

	// ==== flay event
	// comment change
	$('.container-flay .flay .flay-comment').on('click', () => {
		$('.container-flay .flay .flay-comment').hide();
		$('.container-flay .flay .flay-comment-input').show().focus();
	});
	// comment save
	$('.container-flay .flay .flay-comment-input').on('keyup', (e) => {
		if (e.keyCode === 13) {
			let commentText = $('.container-flay .flay .flay-comment-input').val().trim();
			if (!String.isBlank(commentText)) {
				currentFlay.video.comment = commentText;
				$('.container-flay .flay .flay-comment').html(commentText);
				console.log('comment saving', currentFlay);
				API.Video.save(currentFlay.video);
			}
			$('.container-flay .flay .flay-comment').show().toggleClass('comment-empty', String.isBlank(commentText));
			$('.container-flay .flay .flay-comment-input').hide();
		}
	});
	// actress favorite
	$('.flay-info-actress').on('change', 'input[name="actressFavorite"]', (e) => {
		console.log('flay-actress-favorite-input', e.target, $(e.target).prop('checked'));
		const actressFavorite = $(e.target).prop('checked');
		const actress = $(e.target).closest('.flay-actress').data('actress');
		actress.favorite = actressFavorite;
		console.log('change actress favorite', actress);
		API.Actress.save(actress);
	});
	// rank change
	$('.flay-rank input').on('change', (e) => {
		const newRank = Number($(e.target).val());
		currentFlay.video.rank = newRank;
		console.log('rank change', newRank, currentFlay);
		API.Video.save(currentFlay.video);
	});
	// play click
	$('.flay-movie').on('click', () => {
		console.log('play call', currentFlay);
		API.Flay.play(currentFlay);
	});
	// tag click
	$('.flay-info-tag').on('change', 'input:checkbox', (e) => {
		console.log('tag toggle', e.target, $(e.target).prop('checked'));
		const tagChecked = $(e.target).prop('checked');
		const tag = $(e.target).closest('.flay-tag').data('tag');
		if (tagChecked) {
			currentFlay.video.tags.push(tag);
		} else {
			const tagIndex = Tag.indexOf(currentFlay.video.tags, tag);
			currentFlay.video.tags.splice(tagIndex, 1);
		}
		console.log('changed tag', currentFlay.video);
		API.Video.save(currentFlay.video);
	});

	// ==== pagination: wheel, key
	$(document).on('wheel keyup', (e) => {
		e.stopPropagation();
		const eventCode = e.keyCode || e.originalEvent.wheelDelta;
		switch (eventCode) {
			case 32: // space -> random
				goPage(Random.getInteger(0, filteredFlayList.length - 1));
				break;
			case 37: // left key -> previous
			case 120: // wheel up
				goPage(currentFlayIndex - 1);
				break;
			case 39: // right key -> next
			case -120: // wheel down
				goPage(currentFlayIndex + 1);
				break;
			default:
				break;
		}
	});
}

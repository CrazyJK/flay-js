/**
 * flayHome.js
 */

let flayList = [];

// $(document).ready(() => {
// });

$.ajax({
	url: '/api/flay/list',
	success: (list) => {
		flayList = list;
		console.log('list.length', flayList.length);

		displayFlay();
	},
});

function displayFlay() {
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

	const filteredList = new Array();
	flayList.forEach((flay) => {
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
		filteredList.push(flay);
	});
	console.log('filteredList', filteredList.length);

	// choice flay
	const flay = filteredList[0];
	console.log(flay);

	// show
	$('.container-flay .flay .flay-cover').css({
		backgroundImage: 'url(/api/cover/' + flay.opus + ')',
	});
	$('.container-flay .flay .flay-studio ').html(flay.studio);
	$('.container-flay .flay .flay-opus   ').html(flay.opus);
	$('.container-flay .flay .flay-release').html(flay.release);
	$('.container-flay .flay .flay-title  ').html(flay.title);
	$('.container-flay .flay .flay-info-actress').empty();
	for (const actressName of flay.actress) {
		$.ajax({
			url: '/api/actress/' + actressName,
			success: (actress) => {
				$('.container-flay .flay .flay-info-actress').append(`
					<div class="flay-actress">
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
					</div>
				`);
			},
		});
	}
	$('.container-flay .flay .flay-info-rank input#flay-rank' + flay.video.rank).prop('checked', true);
}

// eventListener
$('#searchKeyword').on('keyup', (e) => {
	if (e.keyCode === 13) {
		displayFlay();
	}
});
$('.flay-navbar input[type="checkbox"]').on('change', displayFlay);

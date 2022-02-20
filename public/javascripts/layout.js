/**
 * layout js
 */

$(document).ready(() => {
	setActiveMenu();
});

function setActiveMenu() {
	$('#navbarNavAltMarkup .nav-link').removeClass('active').attr('aria-current', '');
	$('#navbarNavAltMarkup .nav-link[href="' + location.pathname + '"]')
		.addClass('active')
		.attr('aria-current', 'page');
}

console.log('pathname', location.pathname);
let styleCssName = location.pathname;
if (location.pathname.charAt(location.pathname.length - 1) === '/') {
	styleCssName += 'index';
}
$('head').append(`<link rel="stylesheet" href="/stylesheets${styleCssName}.css">`);

/**
 * layout js
 */

$(document).ready(() => {
	setActiveMenu();
	setThemeToggle();
});

function setActiveMenu() {
	$('#navbarNavAltMarkup .nav-link').removeClass('active').attr('aria-current', '');
	$('#navbarNavAltMarkup .nav-link[href="' + location.pathname + '"]')
		.addClass('active')
		.attr('aria-current', 'page');
}

function setThemeToggle() {
	$('#themeToggler').on('change', () => {
		const isDarkTheme = $('#themeToggler').prop('checked');
		$('html').attr('data-theme', isDarkTheme ? 'dark' : 'light');
		$('#themeToggler ~ label').html(isDarkTheme ? 'Dark' : 'Light');
		LocalStorageItem.set('flayground.theme', isDarkTheme);
	});

	const theme = LocalStorageItem.getBoolean('flayground.theme', false);
	$('#themeToggler').prop('checked', theme).trigger('change');
}

console.log('pathname', location.pathname);
let styleCssName = location.pathname;
if (location.pathname.charAt(location.pathname.length - 1) === '/') {
	styleCssName += 'index';
}
$('head').append(`<link rel="stylesheet" href="/stylesheets${styleCssName}.css">`);

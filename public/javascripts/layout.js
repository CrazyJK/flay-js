/**
 * layout js
 */

const Layout = {
	setActiveMenu: () => {
		$('#navbarNavAltMarkup .nav-link').removeClass('active').attr('aria-current', '');
		$('#navbarNavAltMarkup .nav-link[href="' + location.pathname + '"]')
			.addClass('active')
			.attr('aria-current', 'page');
	},
	setThemeToggle: () => {
		$('#themeToggler').on('change', () => {
			const isDarkTheme = $('#themeToggler').prop('checked');
			$('#themeToggler ~ label').html(isDarkTheme ? 'Dark' : 'Light');
			$('html').attr('data-theme', isDarkTheme ? 'dark' : 'light');
			LocalStorageItem.set('flayground.theme', isDarkTheme);
		});

		const theme = LocalStorageItem.getBoolean('flayground.theme', false);
		$('#themeToggler').prop('checked', theme).trigger('change');
	},
	setStylesheet: () => {
		let styleCssName = location.pathname;
		if (location.pathname.charAt(location.pathname.length - 1) === '/') {
			styleCssName += 'index';
		}
		$('head').append(`<link rel="stylesheet" href="/stylesheets${styleCssName}.css">`);
	},
};

$(document).ready(() => {
	Layout.setStylesheet();
	Layout.setActiveMenu();
	Layout.setThemeToggle();
});

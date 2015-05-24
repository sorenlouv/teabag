function config($compileProvider, $mdThemingProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);

	// Configure a dark theme with primary foreground yellow
	$mdThemingProvider.theme('docs-dark', 'default')
		.primaryPalette('blue')
		.dark();
}

module.exports = ['$compileProvider', '$mdThemingProvider', config];

function config($compileProvider, $mdThemingProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
	$mdThemingProvider.theme('default');
}

module.exports = ['$compileProvider', '$mdThemingProvider', config];

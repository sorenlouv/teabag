function config($compileProvider, $mdThemingProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(blob):/);

	$mdThemingProvider.theme('default');
}

module.exports = ['$compileProvider', '$mdThemingProvider', config];

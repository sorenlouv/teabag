function config($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
}

module.exports = ['$compileProvider', config];

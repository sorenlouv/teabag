angular.module('teabagApp', ['ngMaterial'])
	.config(require('./config.js'))
	.run(['$templateCache',
		function($templateCache) {
			$templateCache.put('main.html', require('./modules/main/main.html'));
			$templateCache.put('upload.html', require('./modules/upload/upload.html'));
			$templateCache.put('download.html', require('./modules/download/download.html'));
		},
	])

	// Controllers
	.controller('mainCtrl', require('./modules/main/mainCtrl'))
	.controller('uploadCtrl', require('./modules/upload/uploadCtrl'))
	.controller('downloadCtrl', require('./modules/download/downloadCtrl'))

	// Services
	.service('torrentService', require('./services/torrentService'))
	.service('socketService', require('./services/socketService'))

	// Directives
	.directive('customOnChange', require('./directives/customOnChange'))
	.directive('dragDrop', require('./directives/dragDrop'));

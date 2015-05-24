angular.module('myApp', ['ngMaterial'])
	.run(['$templateCache',
		function($templateCache) {
			$templateCache.put('views/main.html', require('../views/main.html'));
		},
	])
	.controller('mainCtrl', require('./controllers/mainCtrl'))
	.service('userService', require('./services/userService'))
	.service('torrentService', require('./services/torrentService'))
	.service('socketService', require('./services/socketService'))
	.directive('customOnChange', require('./directives/customOnChange'))
	.config(require('./config.js'));

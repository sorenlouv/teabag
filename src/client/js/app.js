var angular = require('angular');
angular.module('myApp', [])
	.run(['$templateCache',
		function($templateCache) {
			$templateCache.put('views/main.html', require('../views/main.html'));
		},
	])
	.controller('mainCtrl', require('./controllers/mainCtrl'))
	.directive('customOnChange', require('./directives/customOnChange'))
	.config(require('./config.js'));

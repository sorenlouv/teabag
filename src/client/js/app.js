var angular = require('angular');
angular.module('myApp', [])
	.controller('mainCtrl', require('./mainCtrl'))
	.directive('customOnChange', require('./customOnChange'))
	.config(require('./config.js'));

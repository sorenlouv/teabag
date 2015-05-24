var uuid = require('uuid');

function userService(socketService) {
	var service = {};

	service.setName = function(name) {
		if (!name){
			return;
		}
		localStorage.setItem('userName', name);
		socketService.emit('setName', name);
	};

	service.getName = function() {
		return localStorage.getItem('userName');
	};

	return service;
}

module.exports = ['socketService', userService];

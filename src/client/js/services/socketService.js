var io = require('socket.io-client');

function socketService($rootScope) {
	var socket = io.connect('http://localhost:3000');
	var service = {
		isConnected: false,
	};

	socket.on('connect', function() {
		service.isConnected = true;
		$rootScope.$digest();
	});

	socket.on('disconnect', function() {
		service.isConnected = false;
		$rootScope.$digest();
	});

	service.emit = function() {
		socket.emit.apply(socket, arguments);
	};

	service.on = function(name, handler) {
		socket.on(name, handler);
	};

	service.getId = function() {
		return socket.id;
	};

	return service;
}

module.exports = ['$rootScope', socketService];

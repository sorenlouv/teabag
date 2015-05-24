var io = require('socket.io-client');

function socketService() {
	var service = {};
	var socket = io.connect('http://localhost:3000');

	socket.on('connect', function() {
		service.isConnected = true;
	});

	socket.on('disconnect', function() {
		service.isConnected = false;
	});

	service.emit = function() {
		socket.emit.apply(socket, arguments);
	};

	service.on = function(name, handler) {
		socket.on(name, handler);
	};

	return service;
}

module.exports = [socketService];

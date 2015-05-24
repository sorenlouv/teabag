var io = require('socket.io-client');

function socketService() {
	var service = {};
	var socket = io.connect('http://192.168.0.101:3000');

	service.emit = function() {
		socket.emit.apply(socket, arguments);
	};

	service.on = function(name, handler) {
		socket.on(name, handler);
	};

	return service;
}

module.exports = [socketService];

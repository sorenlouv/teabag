var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/users', function(req, res) {
	res.send(users);
});

var users = {};
io.on('connection', function(socket) {
	users[socket.id] = {};
	emitUsersToAll();

	socket.on('setTorrents', function(torrents) {
		if (torrents){
			users[socket.id].torrents = torrents;
			emitUsersToAll();
		}
	});

	socket.on('disconnect', function() {
		delete users[socket.id];
		emitUsersToAll();
	});

	function emitUsersToAll() {
		io.sockets.emit('users', users);
	}
});

server.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

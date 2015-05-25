var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('lodash');

app.use(express.static('public'));

app.get('/userTorrents', function(req, res) {
	res.send(userTorrents);
});

var userTorrents = [];
io.on('connection', function(socket) {
	var userId = socket.id;
	emitTorrentsToAll();

	socket.on('torrent:uploaded', function(torrent) {
		if (torrent){
			torrent.userId = socket.id;
			userTorrents.push(torrent);
			emitTorrentsToAll();
		}
	});

	socket.on('disconnect', function() {
		_.remove(userTorrents, {userId: userId});
		emitTorrentsToAll();
	});

	function emitTorrentsToAll() {
		io.sockets.emit('userTorrents:updated', userTorrents);
	}
});

server.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

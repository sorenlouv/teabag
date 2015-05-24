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
	socket.emit('users', users);

	socket.on('setName', function(name) {
		if (name) {
			users[socket.id].name = name;
			socket.broadcast.emit('users', users);
		}
	});

	socket.on('setUploads', function(uploads) {
		if (uploads){
			users[socket.id].uploads = uploads;
			socket.broadcast.emit('users', users);
		}
	});

	socket.on('disconnect', function() {
		delete users[socket.id];
	});
});

server.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

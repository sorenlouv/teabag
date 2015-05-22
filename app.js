var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.send('Hello World!');
});

io.on('connection', function(socket) {
	// console.log(io.sockets.adapter.nsp.connected);
	console.log('logon');
	// socket.emit('news', {
	// 	hello: 'world'
	// });
	// socket.on('my other event', function(data) {
	// 	console.log(data);
	// });

	io.on('disconnect', function() {
		console.log('logoff');
	});
});

server.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

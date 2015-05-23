var Q = require('q');
var _ = require('LoDash');
var io = require('socket.io-client');
var WebTorrent = require('webtorrent');
var dragDrop = require('drag-drop/buffer');
function mainCtrl($scope) {
	// var socket = io.connect('http://localhost:3000');
	// socket.on('news', function(data) {
	// 	console.log(data);
	// 	socket.emit('my other event', {
	// 		my: 'data'
	// 	});
	// });

	function getFileUrl(file) {
		return Q.Promise(function(resolve, reject) {
			file.getBlobURL(function(err, url) {
				if (err) {
					reject(err);
				}
				resolve({
					name: file.name,
					url: url,
				});
			});
		});
	}

	setInterval(function() {
		var torrent = $scope.downloadTorrent;
		if (torrent){
			var progress = (100 * torrent.downloaded / torrent.parsedTorrent.length).toFixed(1);
			console.log('progress', progress);
		}
	}, 100);

	$scope.getFiles = function(infoHash) {
		$scope.isLoadingDownloading = true;
		var client = new WebTorrent();
		$scope.downloadTorrent = client.add(infoHash, function(torrent) {
			var promises = torrent.files.map(function(file) {
				return getFileUrl(file);
			});

			Q.all(promises).then(function(files) {
				$scope.isLoadingDownloading = false;
				$scope.files = files;
				$scope.$digest();
			}).done();
		});
	};

	$scope.upload = function(event) {
		$scope.isLoading = true;
		$scope.$digest();
		var client = new WebTorrent();
		client.on('warning', function(e) {
			console.log('warning', e);
		});

		client.on('error', function(e) {
			console.log('error', e);
		});

		client.on('torrent', function(torrent) {
			console.log('torrent', torrent);
		});


		var files = event.target.files;
		client.seed(files, function onTorrent(torrent) {
			$scope.isLoading = false;
			$scope.uploadTorrent = torrent;
			$scope.$digest();
		});
	};
}
module.exports = ['$scope', mainCtrl];

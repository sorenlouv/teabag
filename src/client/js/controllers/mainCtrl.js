
var _ = require('lodash');
var WebTorrent = require('webtorrent');
var dragDrop = require('drag-drop/buffer');
function mainCtrl($scope, $interval, userService, torrentService, socketService) {
	$scope.torrents = {
		download: torrentService.getDownloads(),
		upload: torrentService.getUploads(),
	};
	$scope.isLoading = false;
	$scope.userName = userService.getName();

	$scope.$watch('userName', function(name) {
		userService.setName(name);
	});

	socketService.on('connect', function() {
		socketService.emit('setName', $scope.userName);
		socketService.emit('setUploads', $scope.torrents.upload);
	});

	socketService.on('users', function(users) {
		$scope.users = users;
		$scope.$digest();
	});

	$scope.$watch(function() {
		return socketService.isConnected;
	}, function(isConnected) {
		$scope.isConnected = isConnected;
	});

	$scope.upload = function($event) {
		$scope.isLoading = true;
		$scope.$digest();
		var files = $event.target.files;

		torrentService.seed(files)
			.then(function(torrent) {
				torrentService.setUpload(torrent);
				$scope.isLoading = false;
				$scope.$digest();
				console.log('Seeding torrent', torrent.infoHash);
			})
			.done();
	};

	$scope.download = function(infoHash) {
		var client = new WebTorrent();
		var torrent = client.add(infoHash, function(torrent) {
			torrentService.getFileUrls(torrent)
				.then(function(files) {
					torrentService.setDownload(torrent, files);
					$scope.$digest();
				})
				.done();
		});
		torrentService.setDownload(torrent);
	};

	$interval(function() {
		_.each($scope.torrents.download, function(torrent) {
			torrent.progress = torrentService.getProgress(torrent.obj);
			console.log('progress', torrent.progress);
		});
	}, 500);
}
module.exports = ['$scope', '$interval', 'userService', 'torrentService', 'socketService', mainCtrl];

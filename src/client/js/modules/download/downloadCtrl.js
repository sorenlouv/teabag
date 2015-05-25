var WebTorrent = require('webtorrent');
var _ = require('lodash');

function downloadCtrl($scope, $interval, torrentService, socketService) {
	$scope.downloadTorrents = torrentService.getDownloads();
	$scope.users = {};

	socketService.on('users', function(users) {
		$scope.users = users;
		$scope.$digest();
	});

	$scope.hasAnyUserTorrents = function() {
		return _.some($scope.users, $scope.hasUserTorrents);
	};

	$scope.hasUserTorrents = function(user) {
		return !_.isEmpty(user.torrents);
	};

	$scope.hasDownloads = function() {
		return !_.isEmpty($scope.downloadTorrents);
	};

	$scope.download = function(infoHash, torrentName) {
		var client = new WebTorrent();
		var torrent = client.add(infoHash, function(torrent) {
			torrentService.getFileUrls(torrent)
				.then(function onDownloadFinished(files) {
					torrentService.downloadCompleted(torrent, files);
					$scope.$digest();
				})
				.done();
		});
		torrentService.downloadStarted(torrent, torrentName);
	};

	setInterval(function() {
		_.each($scope.downloadTorrents, function(torrent) {
			torrent.progress = torrentService.getProgress(torrent.obj);
			console.log('progress', torrent.progress);
		});

		var hasActiveDownloads = _.some($scope.downloadTorrents, {isCompleted: false});
		if (hasActiveDownloads) {
			$scope.$digest();
		}

		_.each($scope.downloadTorrents, function(torrent) {
			torrent.isCompleted = torrent.progress === 100;
		});
	}, 2000);
}

module.exports = ['$scope', '$interval', 'torrentService', 'socketService', downloadCtrl];

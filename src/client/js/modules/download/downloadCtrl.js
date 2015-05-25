var WebTorrent = require('webtorrent');
var _ = require('lodash');

function downloadCtrl($scope, $sce, torrentService, socketService) {
	var pendingTorrents = {};
	$scope.userTorrents = [];

	socketService.on('connect', function() {
		$scope.currentUserId = socketService.getId();
	});

	socketService.on('userTorrents:updated', function(userTorrents) {
		$scope.userTorrents = getFilteredUserTorrents(userTorrents);
		$scope.$digest();
	});

	$scope.getFileType = function(file) {
		return torrentService.getFileType(file.name);
	}

	$scope.getTrustedUrl = function(url) {
		return $sce.trustAsResourceUrl(url);
	}

	$scope.download = function(infoHash) {
		var client = new WebTorrent();
		var torrent = client.add(infoHash, function(torrent) {
			torrentService.getFileUrls(torrent)
				.then(function onDownloadFinished(files) {
					pendingTorrents[infoHash].files = files;
					$scope.$digest();
				})
				.done();
		});
		pendingTorrents[infoHash] = {
			obj: torrent,
			isDownloaded: false,
		};
	};

	setInterval(function() {
		var hasActiveDownloads;

		_.each(pendingTorrents, function(pendingTorrent, infoHash) {
			var userTorrent = _.find($scope.userTorrents, {infoHash: infoHash});
			if (!userTorrent.isDownloaded) {
				hasActiveDownloads = true;
			}
			updateUserTorrent(userTorrent, pendingTorrent);
		});

		if (hasActiveDownloads) {
			$scope.$digest();
		}
	}, 2000);

	function updateUserTorrent(userTorrent, pendingTorrent) {
		var progress = torrentService.getProgress(pendingTorrent.obj);
		var isDownloaded = progress === 100;

		userTorrent.files = pendingTorrent.files;
		userTorrent.isDownloading = true;
		userTorrent.progress = progress;
		userTorrent.isDownloaded = isDownloaded;
		console.log('progress', progress);
	}

	function getFilteredUserTorrents(userTorrents) {
		var userId = socketService.getId();
		_.remove(userTorrents, {userId: userId});

		return userTorrents.map(function(userTorrent) {
			var pendingTorrent = pendingTorrents[userTorrent.infoHash];
			if (pendingTorrent) {
				updateUserTorrent(userTorrent, pendingTorrent);
			}
			return userTorrent;
		});
	}
}

module.exports = ['$scope', '$sce', 'torrentService', 'socketService', downloadCtrl];

var _ = require('lodash');

function uploadController($scope, $window, torrentService, socketService) {
	$scope.uploadTorrents = [];

	socketService.on('connect', function() {
		if (!_.isEmpty($scope.uploadTorrents)){
			socketService.emit('torrents:sync', $scope.uploadTorrents);
		}
	});

	$scope.isEmpty = function(collection) {
		return _.isEmpty(collection);
	};

	$window.onbeforeunload = function() {
		return $scope.uploadTorrents.length === 0 ? null : 'This action will stop all active file transfers';
	};

	$scope.upload = function(files) {
		var uploadTorrent = {
			name: torrentService.getName(files),
			isUploaded: false,
		};
		$scope.uploadTorrents.push(uploadTorrent);

		torrentService.seed(files)
			.then(function uploadFinished(torrent) {
				uploadTorrent.infoHash = torrent.infoHash;
				uploadTorrent.isUploaded = true;
				socketService.emit('torrent:uploaded', uploadTorrent);
				$scope.$digest();
			})
			.done();

		$scope.$digest();
	};
}

module.exports = ['$scope', '$window', 'torrentService', 'socketService', uploadController];

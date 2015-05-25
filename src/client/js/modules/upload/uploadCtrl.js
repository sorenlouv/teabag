var _ = require('lodash');


function uploadController($scope, torrentService, socketService) {
	$scope.uploadTorrents = [];

	$scope.isEmpty = function(collection) {
		return _.isEmpty(collection);
	};

	$scope.upload = function(files) {
		var uploadTorrent = new torrentService.UploadTorrent(files);
		$scope.uploadTorrents.push(uploadTorrent);

		torrentService.seed(files)
			.then(function uploadFinished(torrent) {
				uploadTorrent.setCompleted(torrent);
				socketService.emit('torrent:uploaded', uploadTorrent);
				$scope.$digest();
			})
			.done();

		$scope.$digest();
	};
}

module.exports = ['$scope', 'torrentService', 'socketService', uploadController];

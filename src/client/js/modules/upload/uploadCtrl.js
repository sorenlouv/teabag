var _ = require('lodash');


function uploadController($scope, $window, torrentService, socketService) {
	$scope.uploadTorrents = [];

	$scope.isEmpty = function(collection) {
		return _.isEmpty(collection);
	};

	$window.onbeforeunload = function() {
		return $scope.uploadTorrents.length === 0 ? null : 'This action will stop all active file transfers';
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

module.exports = ['$scope', '$window', 'torrentService', 'socketService', uploadController];

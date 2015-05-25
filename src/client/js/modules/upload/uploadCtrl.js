var _ = require('lodash');

function uploadController($scope, torrentService, socketService) {
	$scope.uploadTorrents = torrentService.getUploads();

	socketService.on('connect', function() {
		socketService.emit('setTorrents', $scope.uploadTorrents);
	});

	$scope.isEmpty = function(collection) {
		return _.isEmpty(collection);
	};

	$scope.upload = function(files) {
		var uploadId = torrentService.uploadStarted(files);

		torrentService.seed(files)
			.then(function uploadFinished(torrent) {
				torrentService.uploadCompleted(uploadId, torrent);
				$scope.$digest();
			})
			.done();

		$scope.$digest();
	};
}

module.exports = ['$scope', 'torrentService', 'socketService', uploadController];

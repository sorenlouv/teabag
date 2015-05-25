function mainCtrl($scope, socketService) {
	$scope.$watch(function() {
		return socketService.isConnected;
	}, function(isConnected) {
		$scope.isConnected = isConnected;
	});
}
module.exports = ['$scope', 'socketService', mainCtrl];

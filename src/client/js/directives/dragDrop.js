var dragDrop = require('drag-drop/buffer');

function dragDropDirective() {
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {
			var handler = $scope.$eval($attrs.dragDrop);
			dragDrop($element[0], handler);
		},
	};
}

module.exports = [dragDropDirective];

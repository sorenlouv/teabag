function customOnChange() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var onChangeHandler = scope.$eval(attrs.customOnChange);
			element.bind('change', function($event) {
				var files = $event.target.files;
				onChangeHandler(files);
			});
		},
	};
}

module.exports = [customOnChange];

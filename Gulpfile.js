var gulp = require('gulp');
var less = require('gulp-less');
var gutil = require('gulp-util');
var path = require('path');
var browserify = require('gulp-browserify');
var nodemon = require('gulp-nodemon');

gulp.task('scripts', function() {
	gulp.src('./src/client/js/app.js')
		.pipe(browserify({
			insertGlobals: true
		}))
		.on('error', function(e) {
			gutil.log(e.message);
		})
		.pipe(gulp.dest('./public/dist/js'));
});

gulp.task('styles', function() {
	return gulp.src('./src/client/less/*.less')
		.pipe(less({
			paths: [path.join(__dirname, 'less', 'includes')]
		})).on('error', function(e) {
			gutil.log(e.message);
			this.emit('end');
		})
		.pipe(gulp.dest('dist/css'));
});

gulp.task('start', function() {
	nodemon({
		script: 'app.js',
		env: {
			NODE_ENV: 'development'
		},
	});
});

gulp.task('watch', function() {
	gulp.watch('./src/client/less/*.less', ['styles']);
	gulp.watch('./src/client/js/*.js', ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'start', 'watch']);

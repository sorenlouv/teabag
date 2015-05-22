var gulp = require('gulp');
var less = require('gulp-less');
var gutil = require('gulp-util');
var path = require('path');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var stringify = require('stringify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');

var dependencies = ['angular', 'q', 'webtorrent', 'lodash', 'socket.io-client'];

gulp.task('libs', function() {
	return browserify()
		.require(dependencies)
		.bundle()
		.on('error', gutil.log)
		.pipe(source('vendors.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('./public/dist/js'));
});

gulp.task('js', function() {
	browserify('./src/client/js/app.js', {debug: true})
		.external(dependencies)
		.transform(stringify(['.html']))
		.bundle()
		.on('error', gutil.log)
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('./public/dist/js/'));
});

gulp.task('less', function() {
	return gulp.src('./src/client/less/*.less')
		.pipe(less({
			paths: [path.join(__dirname, 'less', 'includes')]
		})).on('error', function(e) {
			gutil.log(e.message);
			this.emit('end');
		})
		.pipe(gulp.dest('./public/dist/css'))
		.pipe(livereload());
});

gulp.task('startServer', function() {
	nodemon({
		watch: ['src/server/*', 'app.js'],
		script: 'app.js',
		env: {
			NODE_ENV: 'development'
		},
	});
});


gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('./src/client/less/*.less', ['less']);
	gulp.watch([
		'./public/index.html',
		'./src/client/js/*.js',
		'./src/client/views/*.html',
	], ['js']);
});

gulp.task('default', ['less', 'libs', 'js', 'startServer', 'watch']);

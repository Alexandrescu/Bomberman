// gulpfile.js
var gulp = require('gulp');

// Running the express
var server = require('gulp-express');
var serverOptions = ['./server.js'];

gulp.task('build', function() {
  gulp
    .src('./bower_components/angular/angular.js')
    .pipe(gulp.dest('./public/javascripts/'))
});

gulp.task('app', function() {
  gulp
    .src('./app/app.js')
    .pipe(gulp.dest('./public/javascripts/'))
});

// This is a bug fix
gulp.task('express:run', function(cb) {
  // Start the server at the beginning of the task
  server.run(serverOptions);
  cb();
});

// Running the express server
gulp.task('server', ['build', 'app', 'express:run'], function () {
  // Restart the server when file changes
  gulp.watch(
    [
      'views/**/*.jade',
      'public/**/*.js'
    ], server.notify);

  gulp.watch(['./app/**/*.js'], ['app']);
  gulp.watch(['server.js'], ['express:run']);
});

gulp.task('default', ['server']);
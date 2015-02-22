// gulpfile.js
var gulp = require('gulp');

// Running the express
var server = require('gulp-express');
var serverOptions = ['./server.js'];

// This is a bug fix
gulp.task('express:run', function(cb) {
  // Start the server at the beginning of the task
  server.run(serverOptions);
  cb();
});

// Running the express server
gulp.task('server', ['express:run'], function () {
  // Restart the server when file changes
  gulp.watch(
    [
      'views/**/*.jade',
      './public/**/*.js'
    ], server.notify);


  gulp.watch(['server.js'], ['express:run']);
});

gulp.task('default', ['server']);
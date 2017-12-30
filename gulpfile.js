var gulp = require('gulp');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var exec = require('child_process').exec;


// Gather js files defined below, insert any partials, and export
gulp.task('js:dev', function() {
    // Add your scripts to array in order of dependancy
    return gulp.src([
            'src/js/*'
        ])
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist/js'));
});



// Same as above but compress the output
gulp.task('js:build', function() {
    // Add your scripts to array in order of dependancy
    return gulp.src([
            'src/js/*'
        ])
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});



gulp.task('zip', function() {
    return exec('zip -r nba-close-games.zip dist/*', function(error, stdout, stderr) {
		if (error) {
			console.error(error);
		}
		if (stdout) {
			console.log(stdout);
		}
		if (stderr) {
			console.log(stderr);
		}
	});
});



// Watches the various files during development
gulp.task('dev:watch', function() {
    gulp.watch(
        [
            'src/**/*'
        ],
        [
            'js:dev'
        ]
    );
});



// The default dev command
gulp.task('default', function() {
    runSequence(
        'dev:watch'
    );
});



// Builds the site for production
gulp.task('build', function(callback) {
    runSequence(
        'js:build',
        'zip'
    );
});

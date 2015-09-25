var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    // clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    cp = require('child_process');

gulp.task('styles', function() {
  return gulp.src('./assets/css/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('./assets/css'))
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src('assets/js/*.js')
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('site.js'))
    .pipe(gulp.dest('javascripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('javascripts'))
    .pipe(gulp.dest('_site/javascripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// gulp.task('clean', function() {
//   return gulp.src(['stylesheets', 'javascripts'], {read: false})
//     .pipe(clean());
// });

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify('Building Jekyll');
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['jekyll-build'], function() {
    browserSync.init(null, {
        server: {
            baseDir: '_site'
        },
        host: "localhost"
    });
});

gulp.task('watch', function() {
  // Watch .sass files
  gulp.watch('./assets/css/*.scss', ['styles']);
  // Watch .js files
  //gulp.watch('src/javascripts/**/*.js', ['scripts']);
  gulp.watch(['index.html', '_layouts/*.html', '_posts/*', '_includes/*.html', 'assets/css/*.scss', 'pages/*'], ['jekyll-rebuild']);
});

gulp.task('default', function() {
    gulp.start('styles', 'browser-sync', 'watch');
});
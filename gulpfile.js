var data          = require('./package.json');

var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    clean         = require('gulp-clean'),
    imagemin      = require('gulp-imagemin'),
    jshint        = require('gulp-jshint'),
    livereload    = require('gulp-livereload'),
    minifyCss     = require('gulp-minify-css'),
    minifyHtml    = require('gulp-minify-html'),
    rename        = require('gulp-rename'),
    replace       = require('gulp-replace'),
    rev           = require('gulp-rev'),
    sass          = require('gulp-ruby-sass'),
    svgmin        = require('gulp-svgmin'),
    uglify        = require('gulp-uglify'),
    usemin        = require('gulp-usemin'),
    watch         = require('gulp-watch');

var path = {
  src: {
    base: './src',
    sass: './src/sass',
    styles: './src/css',
    scripts: './src/js',
    assets: './src/assets'
  },
  deploy: {
    base: './JSONgym',
    styles: './JSONgym/css',
    scripts: './JSONgym/js',
    assets: './JSONgym/assets'
  }
}


/**
 * Tasks
 */
gulp.task('clean', function(){
  gulp.src([
      path.deploy.base + '/*',
      '!' + path.deploy.base + '/manifest.appcache'
  ], {read: false})
    .pipe(clean());
});

gulp.task('move', ['styles'], function(){
  return gulp.src([
      path.src.styles + '/oldie.css',
      path.src.scripts + '/lib/html5.js',
      path.src.base + '/**/*.{php,txt,json}',
      // path.src.base + '/.htaccess',
      path.src.base + '/manifest.appcache',
      '!' + path.src.base + '/components/**/*.*'
    ], {base: path.src.base})
    .pipe(replace('--timestamp--', Date.now()))
    .pipe(replace('--version--', data.version))
    .pipe(gulp.dest(path.deploy.base))
});

gulp.task('styles', function() {
  return gulp.src(path.src.sass + '/*.sass')
    .pipe(sass({ style: 'expanded', compass: true }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(path.src.styles))
    .pipe(livereload({auto: false}));
});

gulp.task('usemin', ['styles'], function() {
  return gulp.src(path.src.base + '/**/*.html')
    .pipe(usemin({
      css: [minifyCss(), 'concat', rename({suffix: '.' + data.version})],
      html: [minifyHtml({empty:true, comments:true, conditionals:true, quotes:true})],
      js: [uglify({mangle:false}), rename({suffix: '.' + data.version})]
    }))
    .pipe(gulp.dest(path.deploy.base))
});

gulp.task('assets', function() {
  return gulp.src([path.src.base + '/**/*.{jpg,png,svg}'])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(path.deploy.base))
});

gulp.task('build', ['clean', 'usemin', 'move', 'assets']);

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch(path.src.sass + '/**/*.sass', ['styles']);
  gulp.watch([path.src.base + '/**/*.{html,php}']).on('change', livereload.changed);
  gulp.watch([path.src.scripts + '/**/*.js']).on('change', livereload.changed);
});
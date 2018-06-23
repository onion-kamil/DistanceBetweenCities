const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglifyes');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const htmlReaplace = require('gulp-html-replace');
const htmlMin = require('gulp-htmlmin');
const del = require('del');
const sequence = require('run-sequence');

const config = {
  dist: 'dist/',
  src: 'src/',
  cssin: 'src/css/**/*.css',
  jsin: 'src/js/**/*.js',
  imgin: 'src/img/**/*.{jpg,jpeg,png,gif,svg,ico}',
  htmlin: 'src/*.html',
  scssin: 'src/scss/**/*.scss',
  cssout: 'dist/css/',
  jsout: 'dist/js/',
  imgout: 'dist/img/',
  htmlout: 'dist/',
  scssout: 'src/css/',
  cssoutname: 'style.css',
  jsoutname: 'script.js',
  cssreplaceout: 'css/style.css',
  jsreplaceout: 'js/script.js'
};

gulp.task('reload', function(){
  browserSync.reload();
})

gulp.task('serve', ['sass'], function() {
  browserSync({
    server: config.src
  });
  gulp.watch([config.htmlin, config.jsin], ['reload']);
  gulp.watch(config.scssin, ['sass']);
})

gulp.task('sass', function() {
  return gulp.src(config.scssin)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 3 version']
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.scssout))
  .pipe(browserSync.stream());
})

gulp.task('css', function() {
  return gulp.src(config.cssin)
  .pipe(concat(config.cssoutname))
  .pipe(cleanCSS())
  .pipe(gulp.dest(config.cssout));
})

gulp.task('js', function() {
  return gulp.src(config.jsin)
  .pipe(concat(config.jsoutname))
  .pipe(uglify())
  .pipe(gulp.dest(config.jsout));
})

gulp.task('img', function() {
  return gulp.src(config.imgin)
  .pipe(changed(config.imgout))
  .pipe(imagemin())
  .pipe(gulp.dest(config.imgout));
})

gulp.task('html', function() {
  return gulp.src(config.htmlin)
  .pipe(htmlReaplace({
    'css': config.cssreplaceout,
    'js': config.jsreplaceout
  }))
  .pipe(htmlMin({
    sortAttributes: true,
    sortClassName: true,
    collapsWhitespace: true,
  }))
  .pipe(gulp.dest(config.dist))
})

gulp.task('clean', function() {
  return del([config.dist]);
})

gulp.task('build', function() {
  sequence('clean', ['html', 'js', 'css', 'img']);
})

gulp.task('default', ['serve']);
var gulp = require('gulp');
var pkg = require('./package.json');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var autoprefix = require('gulp-autoprefixer');
var rename = require("gulp-rename");
var changed = require('gulp-changed');
var livereload = require('gulp-livereload');
var browserSync = require('browser-sync');
var cmq = require('gulp-combine-media-queries');
var bourbon = require('node-bourbon');
var paths = {
    scss: './assets/css/scss/*.scss'
};

// Combine Media Queries
gulp.task('cmq', function () {
  gulp.src('./assets/css/*.css')
    .pipe(cmq({
      log: true
    }))
    .pipe(gulp.dest('./assets/css/*.css'));
});

// Sass
gulp.task('sass', function() {
    gulp.src('./assets/css/scss/main.scss')
    .pipe(plumber())
    .pipe(sass({
        includePaths: require('node-bourbon').includePaths,
        style: 'compressed',
        sourcemap: false
    }))
    .pipe(minifyCSS())
    .pipe(autoprefix({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(gulp.dest('./assets/css'));
});

// Browser Sync
gulp.task('browser-sync', function() {
    browserSync.init(["./assets/css/*.css", "./assets/js/min/*.js"], {
        server: {
            baseDir: "./"
        }
    });
});

// Minify Task
gulp.task('minify', function() {
    gulp.src('./assets/js/src/*.js')
        .pipe(plumber())
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js/min'))
        // .pipe(livereload());
});

// Comprimir Imagens
gulp.task('images', function(){
    var imgSrc = '.assets/img/*',
        imgDst = '.assets/img';
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

// Salvando arquivo php
gulp.task('php', function(){
    gulp.src('*.php')
        .pipe(livereload());
});

// Salvando arquivo html
gulp.task('html', function(){
    gulp.src('./*.html')
        .pipe(livereload());
});


// Watch Task
gulp.task('watch', ['sass', 'browser-sync'], function() {
    gulp.watch('./assets/css/scss/**/*.scss', ['sass']);
    gulp.watch('./assets/js/src/*.js', ['minify']);
    gulp.watch('*.html', ['html']);
    gulp.watch('*.php', ['php']);
});

// Default Task
gulp.task('default', ['watch', 'minify']);
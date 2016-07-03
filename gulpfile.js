var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat'),
    htmlreplace = require('gulp-html-replace');
    paths = {
        src: './www/src/',
        dist: './www/public/',
        js: 'js/**/*.js',
        scss: 'scss/**/*.scss',
        css: 'css/**/*.css',
        html: '**/*.html',
        minhtml: 'html/**/*.html'
    };

gulp.task('dev-server', function() {
    nodemon({script: 'node-server-dev.js'});
});

gulp.task('server', function() {
    nodemon({script: 'node-server.js'});
});

gulp.task('live-reload', function() {
    return gulp.src([paths.src + '*'])
        .pipe(livereload());
});

// style 파일을 css 로 컴파일한다.
gulp.task('compile-sass', function () {
    return gulp.src(paths.src + paths.scss)
        .pipe(sass())
        .pipe(autoprefixer({browsers: ['IE 9']}))
        .pipe(gulp.dest(paths.src + 'css'));
});

gulp.task('watch', ['dev-server'], function() {
    livereload.listen();
    gulp.watch(paths.src + paths.js, ['live-reload']);
    gulp.watch(paths.src + paths.scss, ['compile-sass', 'live-reload']);
    gulp.watch(paths.src + paths.html, ['live-reload']);
});

// 컴포넌트 및 개발자가 작성한 코드 압축 및 통합.
gulp.task('concat', function() {
    gulp.src([
        './bower_components/angular/angular.min.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.dist + 'js'));
    gulp.src([paths.src + paths.js])        
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist + 'js'));
    gulp.src([
        './bower_components/bootstrap/dist/css/bootstrap.min.css'
    ])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(paths.dist + 'css'));
    gulp.src([paths.src + paths.css])        
        .pipe(concat('app.css'))
        .pipe(cleancss())
        .pipe(gulp.dest(paths.dist + 'css'));
});

gulp.task('replace-path', function() {
    gulp.src(paths.src + paths.html)
        .pipe(htmlreplace({
            'lib_css': './css/vendor.css',
            'app_css': './css/app.css',
            'lib_js': './js/vendor.js',
            'app_js': './js/app.js'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('default', ['concat', 'replace-path', 'server']);
/**
 * your gulpfile
 * created by xiaojie
 * 2016-3-31 00:38:51
*/
var gulp = require('gulp'),
    os = require('os'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    gulpOpen = require('gulp-open'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    md5 = require('gulp-md5-plus'),
    fileinclude = require('gulp-file-include'),
    rimraf = require('gulp-rimraf'),
    spriter = require('gulp-css-spriter'),
    base64 = require('gulp-css-base64'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    minifyCSS = require('gulp-minify-css'),
    connect = require('gulp-connect'),
    fs = require('fs'),
    path = require('path');

var host = {
    path: 'lexam/',
    port: 3000,
    html: 'index.html'
};

var browser = os.platform() === 'linux' ? 'Google chrome' : (
    os.platform() === 'darwin' ? 'Google chrome' : (
    os.platform() === 'win32' ? 'chrome' : 'firefox'));
var pkg = require('./package.json');

// copy images
gulp.task('copy:images', function (done) {
    gulp.src(['src/images/**/*'])
    .pipe(gulp.dest('dist/images'))
    .on('end', done);
});
// compile less and concat files
gulp.task('less', function(done) {
    gulp.src('src/css/*.less')
    .pipe(less())
    .pipe(concat('style.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css/'))
    .on('end', done);
})
// copy css files 
gulp.task('copy:css', function(done) {
    gulp.src(['src/css/**/*'])
    .pipe(gulp.dest('dist/css'))
    .on('end', done);
})


// copy static js files
gulp.task('copy:js', function() {
    gulp.src(['src/js/**/*'])
    .pipe(gulp.dest('dist/js'));
});

//将js加上8位md5,并修改html中的引用路径，该动作依赖build-js
gulp.task('md5:js', ['build-js'], function (done) {
    gulp.src('dist/js/*.js')
        .pipe(md5(8, 'dist/html/*.html'))
        .pipe(gulp.dest('dist/js'))
        .on('end', done);
});

//将css加上8位md5，并修改html中的引用路径，该动作依赖sprite
gulp.task('md5:css', ['sprite'], function (done) {
    gulp.src('dist/css/*.css')
        .pipe(md5(8, 'dist/html/*.html'))
        .pipe(gulp.dest('dist/css'))
        .on('end', done);
});
//雪碧图操作，应该先拷贝图片并压缩合并css
gulp.task('sprite', ['copy:images', 'less'], function (done) {
    var timestamp = +new Date();
    gulp.src('dist/css/style.min.css')
        .pipe(spriter({
            spriteSheet: 'dist/images/spritesheet' + timestamp + '.png',
            pathToSpriteSheetFromCSS: '../images/spritesheet' + timestamp + '.png',
            spritesmithOptions: {
                padding: 10
            }
        }))
        .pipe(base64())
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'))
        .on('end', done);
});
// delete dist/
gulp.task('clean', function (done) {
    gulp.src(['dist'])
        .pipe(rimraf())
        .on('end', done);
});

gulp.task('watch', function (done) {
    gulp.watch('src/**/*', ['less', 'build-js', 'fileinclude'])
        .on('end', done);
});

// gulp.task('server', function () {
//     console.log('connect------------');
//     connect.server({
//         root: host.path,
//         port: host.port,
//     });
// });
gulp.task('server',function(){
    connect.server({
        middleware: function(connect, options) {
        return [
            function(req, res, next) {
                var filepath = path.join(options.root, req.url);
                if ('POSTPUTDELETE'.indexOf(req.method.toUpperCase()) > -1
                    && fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
                    return res.end(fs.readFileSync(filepath));
                }
                return next();
               }
            ];
        },
        hostname: '127.0.0.1',//配置你的主机ip
        port: 8090,//配置你的端口号
        livereload: true
    });
});

gulp.task('open', ['copy:images','copy:js', 'fileinclude','less','build-js','copy:css'], function (done) {
    gulp.src('')
        .pipe(gulpOpen({
            app: browser,
            uri: 'http://localhost:8090/dist/html/'
        }))
        .on('end', done);
});

var myDevConfig = Object.create(webpackConfig);

var devCompiler = webpack(myDevConfig);

//引用webpack对js进行操作
gulp.task("build-js", ['fileinclude'], function(callback) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-js", err);
        gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback();
    });
});
//用于在html文件中直接include文件
gulp.task('fileinclude', function (done) {
    gulp.src(['src/html/*.html'])
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest('dist/html'))
        .on('end', done);
        // .pipe(connect.reload())
});

gulp.task('default', ['server','copy:js','copy:images','less','copy:css','fileinclude', 'md5:css', 'md5:js']);
gulp.task('dev', ['server','copy:images','copy:js', 'fileinclude','less','build-js','copy:css','watch','open']);
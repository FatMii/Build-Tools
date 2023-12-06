var gulp = require("gulp");
var $ = require('gulp-load-plugins')();
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var babel = require("gulp-babel");
var less = require("gulp-less");
var cssClean = require("gulp-clean-css");
var htmlMin = require("gulp-htmlmin");
var livereload = require("gulp-livereload");
var connect = require("gulp-connect");
var open = require("open");


//合并压缩js的任务
gulp.task("js", function () {
  return gulp
    .src("src/js/**/*.js") //找到目标文件,将数据读取到gulp的内存
    .pipe(babel())
    .pipe(concat("build.js")) //合并文件
    .pipe(gulp.dest("dist/js/")) //临时输出文件到本地
    .pipe(uglify()) //压缩文件
    .pipe(rename({ suffix: ".min" })) //重命名
    .pipe(gulp.dest("dist/js/"))
    .pipe(livereload())
    .pipe(connect.reload());
});

//转换less的任务
gulp.task("less", function () {
  return gulp
    .src("src/less/**/*.less") //找到目标文件,将数据读取到gulp的内存
    .pipe(less()) //编译less文件为css文件
    .pipe(gulp.dest("src/css/"))
    .pipe(livereload())
    .pipe(connect.reload());
});

//合并压缩css的任务
gulp.task("css", function () {
  return gulp
    .src("src/css/**/*.css") //找到目标文件,将数据读取到gulp的内存
    .pipe(concat("build.css")) //合并css文件
    .pipe(rename({ suffix: ".min" }))
    .pipe(cssClean({ compatibility: "ie8" }))
    .pipe(gulp.dest("dist/css"))
    .pipe(livereload())
    .pipe(connect.reload());
});

/* gulp.task("css", ["less"], function () {
          保证,处理css之前先处理less任务
      
}); 
*/

//压缩html任务,需要注意修改引入css或js的路径.
gulp.task("html", function () {
  return gulp
    .src("index.html")
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist/"))
    .pipe(livereload());
});

//注册半自动监视任务
gulp.task("watch", ["default"], function () {
  livereload.listen();
  gulp.watch("src/js/**/*.js", ["js"]);
  gulp.watch(["src/css/*.css", "src/less/*.less"], ["css"]);
});

//注册全自动监视任务
gulp.task("server", ["default"], function () {
  connect.server({
    root: "dist/",
    livereload: true,
    port: 5000,
  });
  gulp.watch("src/js/**/*.js", ["js"]);
  gulp.watch(["src/css/*.css", "src/less/*.less"], ["css"]);
});
/**
 * Gulp执行任务默认为异步:
 *       [14:07:05] Using gulpfile D:\github\Gulp\3.x\gulpfile.js
[14:07:05] Starting 'js'...
[14:07:05] Starting 'less'...
[14:07:05] Starting 'css'...
[14:07:05] Finished 'less' after 299 ms
[14:07:05] Finished 'css' after 347 ms
[14:07:05] Finished 'js' after 365 ms
[14:07:05] Starting 'default'...
[14:07:05] Finished 'default' after 34 μs

   如需修改为同步: 删除task中的return;
   [14:08:33] Using gulpfile D:\github\Gulp\3.x\gulpfile.js
[14:08:33] Starting 'js'...
[14:08:33] Finished 'js' after 9.44 ms
[14:08:33] Starting 'less'...
[14:08:33] Finished 'less' after 914 μs
[14:08:33] Starting 'css'...
[14:08:33] Finished 'css' after 1.87 ms
[14:08:33] Starting 'default'...
[14:08:33] Finished 'default' after 35 μs
 */
gulp.task("default", ["js", "less", "css", "html"]);

open("http://localhost:5000")

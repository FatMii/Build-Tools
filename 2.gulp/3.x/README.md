# Gulp
Gulp review
* 三大特点 :
   * 任务化
   * 基于流
   * 可同步或异步

* Gulp 插件
  * gulp-concat: 合并文件(js/css)
  * gulp-uglify: 压缩js文件
  * gulp-rename: 文件重命名
  * gulp-less: 编译less
  * gulp-clean-css:压缩css
  * gulp-livereload: 实时自动编译刷新

* API
  * gulp.src(filePath)
    * 指向指定路径的所有文件,返回文件流对象
    * 用于读取文件
   
  * gulp.dest(dirPath)
    * 指向指定的所有文件夹
  
----

# 使用gulp-uglify压缩js文件时遇到ES6语法会报错
> internal/streams/legacy.js:57
      throw er; // Unhandled stream error in pipe.
      ^
GulpUglifyError: unable to minify JavaScript
    at D:\github\Gulp\3.x\node_modules\gulp-uglify\lib\minify.js:56:15
    at DestroyableTransform._transform (D:\github\Gulp\3.x\node_modules\gulp-uglify\composer.js:12:19)
    at DestroyableTransform.Transform._read (D:\github\Gulp\3.x\node_modules\readable-stream\lib\_stream_transform.js:184:10)
    at DestroyableTransform.Transform._write (D:\github\Gulp\3.x\node_modules\readable-stream\lib\_stream_transform.js:172:83)
    at doWrite (D:\github\Gulp\3.x\node_modules\readable-stream\lib\_stream_writable.js:428:64)
    at writeOrBuffer (D:\github\Gulp\3.x\node_modules\readable-stream\lib\_stream_writable.js:417:5)
    at DestroyableTransform.Writable.write (D:\github\Gulp\3.x\node_modules\readable-stream\lib\_stream_writable.js:334:11)
    at DestroyableTransform.ondata (internal/streams/legacy.js:15:31)

> 解决方法:
  ```dotnetcli
  1. 安装es6转es5所需要的所有npm依赖包
  // babel 依赖的包 但是看babel官方说并没有依赖这个如果不安装会报错
npm install babel-core --save-dev
// 转码所需要的模板
npm install babel-preset-env --save-dev
// babel转码的核心包这里安装7的版本如果不写默认安装8.0.0的版本
//但是在npm上看到的是最新版本是7的 如果安装了8的版本会一直报找不到babel-core的错误
npm install gulp-babel@7 babel-core --save-dev
// 用非严禁模式编译
npm install babel-plugin-transform-remove-strict-mode --save-dev

 2. 在根目录下面创建一个.babelrc文件这个文件是babel的配置文件，就是和gulpfile.js同级的文件夹下面，编写如下内容
 	{
	  "presets": [
	    [ "env",
	      { "modules": false }
	    ]
	  ],
	  "plugins": ["transform-remove-strict-mode"]
	}
  3. 在gulpfile.js里面引入babel
  let babel = require("gulp-babel")
  const babel = require('gulp-babel');
gulp.task('js',function () {
    return gulp.src(app.srcPath+'js/**/*.js')
        .pipe(babel())
        .pipe(concat('index.js'))
        .pipe(gulp.dest(app.buildPath+'js/'))
        .pipe(uglify())
        .pipe(gulp.dest(app.distPath+'js'))
        .pipe(connect.reload())
});
  ```
* 扩展
   * 打包下载gulp插件
   * 下载打包插件: gulp-load-plugins
   *  npm install gulp-load-plugins --save-dev
   *  引入: var $ = require('gulp-load-plugins')()
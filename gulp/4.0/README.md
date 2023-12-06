
```
Gulp3:

gulp.task('styles', ['clean'], function() {
    ...
});

Gulp4:

gulp.task('styles', gulp.series('clean', function() {
    ...
}));
```

在改写的时候，不要忘了其实现在你处理主要任务的函数也是放在gulp.series里面调用，所以不要忘了在结尾加上括号。很多人经常犯这个错误。

注意，由于gulp.series和gulp.parallel返回的是一个函数，所以他们是可以被嵌套调用的。如果您的任务往往有多个依赖任务，你会经常嵌套调用它们。比如这个例子：

```
Gulp3:
gulp.task('default', ['scripts', 'styles'], function() {
    ...
});

Gulp4:

gulp.task('default', gulp.series(gulp.parallel('scripts', 'styles'), function() {
    ...
}));
```

# 依赖陷阱
在Gulp3中，假设你设定几个有相同依赖的任务，然后运行它们，Gulp会检测出这些将要运行的任务的依赖是一样的，然后只会运行一次依赖任务。然而现在我们不再显式的指定任务之间的依赖，而是通过series和parallel函数来组合任务，这样会导致那些本应该只运行一次的任务，变成多次运行。Gulp4是无法做出相应的区分的。所以我们要改变我们指定任务依赖的思路。

让我们看一下这个Gulp3的例子：
```
// default任务，需要依赖scripts和styles
gulp.task('default', ['scripts', 'styles'], function() {...});

// script折styles任务都依赖clean
gulp.task('styles', ['clean'], function() {...});
gulp.task('scripts', ['clean'], function() {...});

// clean任务用来清空目录
gulp.task('clean', function() {...});
```

我们注意到styles和scripts任务都依赖clean任务。当你运行default任务时，Gulp3会率先运行styles和scripts任务，又因为检测到这两个任务都有各自的依赖，所以需要优先运行它们的依赖任务，这时Gulp注意到这两个任务都依赖于clean，于是Gulp3将确保在回到styles和scripts任务之前，clean任务会被执行且执行一次。这很有用！但遗憾的是，我们在新版本中将没办法运用这个特性。如果你在迁移到Gulp4的过程中只像下面的例子一样做了简单的改变，clean任务将会被执行两次：

```dotnetcli
gulp.task('clean', function() {...});
gulp.task('styles', gulp.series('clean', function() {...}));
gulp.task('scripts', gulp.series('clean', function() {...}));

gulp.task('default', gulp.parallel('scripts', 'styles'));
```

这是因为parallel和series不是用来解决依赖的；他们只是用来把多个任务合并成一个。所以我们需要把共同依赖的任务抽离出来，然后用一个更大的串行任务来包裹它们，以此来模拟任务依赖关系：

友情提示：你最好不要在定义那些小任务之前就用它们来组合你的default任务。因为在你调用gulp.series("taskName")之前，你必须已经定义好了一个名为"taskName"的任务。所以一般在Gulp4中，我们会在代码的最后才定义default，而在Gulp3中你可以把它放在任何地方。

```
// 任务直接不再有依赖
gulp.task('styles', function() {...});
gulp.task('scripts', function() {...});
gulp.task('clean', function() {...});

// default任务，需要依赖scripts和styles
gulp.task('default', gulp.series('clean', gulp.parallel('scripts', 'styles')));
```

如果照这么写，当你单独运行styles和scripts任务时，clean任务就不会优先自动执行。不过这问题也不大，在之前单独运行clean任务就可以了，一样能把scripts和styles的文件夹清空。又或者你可以重新定义一下你的任务，随你，我也不确定怎样会更好。



# 监听
处理文件系统的监听和响应的API也有了一点进步。之前的API中，在我们传入一个glob通配符和可选参数后，我们可以再指定一个任务数组或者一个回调函数用来处理事件数据。可是现在，任务队列都是由serise或者parallel函数合并而成，这样你就无法用一个回调来区分这些任务，所以我们取消了这种简单监听回调的方式。取而代之的是，gulp.watch将像之前一样会返回一个的“观察”对象，不过你可以对它添加各种事件监听：

```
// 旧版
gulp.watch('js/**/*.js', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// 新版:
var watcher = gulp.watch('js/**/*.js' /* 你可以在这里传一些参数或者函数 */);
watcher.on('all', function(event, path, stats) {
  console.log('File ' + path + ' was ' + event + ', running tasks...');
});

// 单个事件的监听
watcher.on('change', function(path, stats) {
  console.log('File ' + path + ' was changed, running tasks...');
});

watcher.on('add', function(path) {
  console.log('File ' + path + ' was added, running tasks...');
});

watcher.on('unlink', function(path) {
  console.log('File ' + path + ' was removed, running tasks...');
});
```
正如所看到的，在all和change的事件处理中，你还可以接受一个stats对象。stats对象只在他们可用的时候出现（我也不确定他们什么时候可用什么时候不可用），不过你可以设置alwaysStat选项的值为true来让它始终出现。Gulp使用了chokidar库来实现这些东西，阅读chokidar的文档能让你了解的更多，尽管chokidar并不支持在事件回调中指定第三个参数。


# 使用函数
由于现在每个任务基本上就是一个函数，不需要任何依赖或其他的什么，实际上他们也仅仅是需要一个任务运行器来确认异步任务何时结束，我们可以把函数定义从gulp.task中独立出来，而不仅仅作为一个简单回调函数传给gulp.task。举个例子，这个代码之前我们在“依赖陷阱”那个章节的结论：

```
gulp.task('styles', function() {...});
gulp.task('scripts', function() {...});
gulp.task('clean', function() {...});

gulp.task('default', gulp.series('clean', gulp.parallel('scripts', 'styles')));

我把它变成：

// 只需要在`series` 和 `parallel` 中间引用函数名就能组成一个新任务
gulp.task('default', gulp.series(clean, gulp.parallel(scripts, styles)));

// 把单个任务变成一个函数
function styles() {...}
function scripts() {...}
function clean() {...}
```

如果你想给函数起个别名，你可以在函数的displayName属性中指定它：
```
function styles(){...}
styles.displayName = "pseudoStyles";
gulp.task(styles);
现在任务名将会从“styles”变成“pseudoStyles”。你也可以通过指定description属性来给你的任务添加描述。你可以通过gulp --tasks命令来查看这些描述：

function styles(){...}
styles.displayName = "pseudoStyles";
styles.description = "Does something with the stylesheets."
gulp.task(styles);
$ gulp --tasks
[12:00:00] Tasks for ~/project/gulpfile.js
[12:00:00] └── pseudoStyles  Does something with the stylesheets.
```

你甚至可以给你其他已经注册的任务添加描述，比如default。首先你要运行gulp.task('taskName')来取人这个任务已经被定义过了，然后才给它添加描述：
```
gulp.task('default', gulp.series(clean, gulp.parallel(scripts, styles)));

// Use gulp.task to retrieve the task
var defaultTask = gulp.task('default');
// give it a description
defaultTask.description = "Does Default Stuff";
```

我们也可以简化它，取消中间值：

```
gulp.task('default', gulp.series(clean, gulp.parallel(scripts, styles)));
gulp.task('default').description = "Does Default Stuff";
对那些不熟悉你的项目的人来说，这些描述是相当有用的。所以我建议在任何情况下都要添加它：有时它比注释还更有用。最后总结一下，这是我推荐的Gulp4的最佳实践：

gulp.task('default', gulp.series(clean, gulp.parallel(scripts, styles)));
gulp.task('default').description = "This is the default task and it does certain things";

function styles() {...}
function scripts() {...}
function clean() {...}
```

如果你运行gulp --tasks，你将会看到：
```
$ gulp --tasks
[12:00:00] Tasks for ~\localhost\gulp4test\gulpfile.js
[12:00:00] └─┬ default  This is the default task and it does certain things
[12:00:00]   └─┬ <series>
[12:00:00]     ├── clean
[12:00:00]     └─┬ <parallel>
[12:00:00]       ├── scripts
[12:00:00]       └── styles
你会发现这里不仅有你添加的描述，你还能看到完整的运行队列树。```
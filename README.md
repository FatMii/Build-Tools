# 构建工具的作用是什么？

本质上，构建工具就是将前端源代码转换为浏览器可识别的代码。

先思考一个问题？ 前端代码是否必须通过构建才可以在浏览器中运行呢？当然不是。如下：

```
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <div id="root"/>
    <script type="text/javascript">
      document.getElementById('root').innerText = 'Hello World'
    </script>
  </body>
</html>

// 上述代码，我们只需要按格式写几个 HTML 标签，插入简单的 JS 脚本，打开浏览器，一个 Hello World 的前端页面就呈现在我们面前了

```

但是当项目进入真正的实战开发，代码规模开始急速扩张后，大量逻辑混杂在一个文件之中就变得难以维护起来。即使是将不同的代码放在不同的文件中，但是这也仅仅解决了代码组织混乱的问题，还存在很多问题，比如：

1. 大量的全局变量，代码之间的依赖是不透明的，任何代码都可能悄悄的改变了全局变量。

2. 脚本的引入需要依赖特定的顺序。

后续出现过一些 IIFE、命名空间等解决方案，但是从本质上都没有解决依赖全局变量通信的问题。

# 社区模块化阶段

## AMD/CMD - 异步模块加载

为了解决浏览器端 JS 模块化的问题，出现了通过引入相关工具库的方式来解决这一问题。出现了两种应用比较广的规范及其相关库：AMD(RequireJs) 和 CMD(Sea.js)。AMD 推崇依赖前置、提前执行，CMD 推崇依赖就近、延迟执行。下面领略下相关写法

```
// RequireJs
// 加载完jquery后，将执行结果 $ 作为参数传入了回调函数
define(["jquery"], function ($) {
    $(document).ready(function(){
        $('#root')[0].innerText = 'Hello World';
    })
    return $
})


// Sea.js
// 预加载jquery
define(function(require, exports, module) {
    // 执行jquery模块，并得到结果赋值给 $
    var $ = require('jquery');
    // 调用jquery.js模块提供的方法
    $('#header').hide();
});

```

两种模块化规范实现的原理基本上是一致的，只不过各自坚持的理念不同。

两者都是以异步的方式获取当前模块所需的模块，不同的地方在于 AMD 在获取到相关模块后立即执行，CMD 则是在用到相关模块的位置再执行的。

**AMD/CMD 解决问题**

1. 手动维护代码引用顺序。从此不再需要手动调整 HTML 文件中的脚本顺序，依赖数组会自动侦测模块间的依赖关系，并自动化的插入页面。

2. 全局变量污染问题。将模块内容在函数内实现，利用闭包导出的变量通信，不会存在全局变量污染的问题



## Gulp/Grunt

在 Google Chrome 推出 V8 引擎后，基于其高性能和平台独立的特性，Nodejs 这个 JS 运行时也现世了。至此，JS 打破了浏览器的限制，拥有了文件读写的能力。Nodejs 不仅在服务器领域占据一席之地，也将前端工程化带进了正轨。

在这个背景下，第一批基于 Node.js 的构建工具出现了。


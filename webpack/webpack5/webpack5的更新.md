- 1.clear:true 直接配置就可以删除旧文件,webpack4要下载clean-webpack-plugin
- 2.资源处理器
- 
在 webpack 5 之前，没有内置资源模块，所以，我们通常使用，file-loader url-loader raw-loader之类的loader去处理。

```dotnetcli
Asset Modules 它的值有四种，asset/resource（对应file-loader）、asset/inline（对应url-loader）、asset/source（对应raw-loader）、asset。
```


- 3.提供持久化缓存,在webpack 5之前，webpack是没有提供持久化缓存，我们开发的时候需要使用类似 cache-loader 来做缓存方面的处理。

```nodejs
webpack4之前:
module.exports = {
  module: {
    rules: [
      {
        test: /.ext$/,
        use: ['cache-loader', ...loaders],
        include: path.resolve('src'),
      },
    ],
  },
};
```


```nodejs
在webpack 5中自身也加入了持久化缓存，缓存生成的 webpack 模块和 chunk，来改善构建速度。cache 会在开发 模式被设置成 type: 'memory' 而且在 生产 模式 中被禁用

module.exports = {
  cache: {
    type: 'filesystem',
  },
};
memory表示会将打包生成的资源存放于内存中。filesystem表示开启了文件系统缓存。
```


- 4.更好的hash算法,
  
  这里指的就是访问web页面时的浏览器缓存，我们也知道，之前有 hash chunckhash contenthash 在 webpack 5中，把hash改成了fullhash。
```nodejs

hash/fullhash
hash/fullhash 是根据打包中的所有文件计算出来的 hash 值，在一次打包中，所有的资源出口文件的filename获得的[hash]都是一样的。

chunckhash
chunckhash顾名思义是根据打包过程中当前 chunck 计算出来的 hash 值。

contenthash
contenthash顾名思义是根据打包时的内容计算出的 hash 值。
```

webpack4对于添加注释和修改变量其实，是会影响它的一个contenthash值的计算，如果是webpack 5的话，就不会影响。


- 5.在webpack 4中，Tree Shaking 对嵌套的导出模块未使用代码无法很好进行 Tree Shaking，当然我们也可以借助一些plugin来实现，但是到了webpack 5得到了很大的改进

- 6.模块联邦 ？？？

# 为什么 Rollup 构建产物很干净？

1. rollup 只对 ESM 模块进行打包，对于 cjs 模块也会通过插件将其转化为 ESM 模块进行打包。所以不会像 webpack 有很多的代码注入。

2. rollup 对打包结果也支持多种 format 的输出，比如：esm、cjs、am 等等，但是 rollup 并不保证代码可靠运行，需要运行环境可靠支持。比如我们输出 esm 规范代码，代码运行时完全依赖高版本浏览器原生去支持 esm，rollup 不会像 webpack 一样注入一系列兼容代码。

3. rollup 实现了强大的 tree-shaking 能力。
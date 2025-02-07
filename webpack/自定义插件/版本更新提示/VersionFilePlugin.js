class VersionFilePlugin {
  apply(compiler) {
    // Webpack编译过程 compiler.hooks.emit异步钩子
    compiler.hooks.emit.tapAsync('versionPlugin', (compilation, callback) => {
      const versionInfo = {
        version: Date.now(),
        buildTime: Date.now(),
      };
      const fileContent = JSON.stringify(versionInfo, null, 2);
      // 将此列表作为新的文件资产插入到webpack生成中：
      compilation.assets['version.json'] = {
        source: () => {
          return fileContent;
        },
        size: () => {
          return fileContent.length;
        },
      };
      callback();
    });
  }
}

module.exports = VersionFilePlugin;

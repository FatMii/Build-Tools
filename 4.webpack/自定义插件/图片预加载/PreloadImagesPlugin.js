// PreloadImagesPlugin.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

class PreloadImagesPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('PreloadImagesPlugin', (compilation) => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        'PreloadImagesPlugin',
        (htmlPluginData, callback) => {
          const images = this.getImages();
          const rel = this.options.rel || 'preload'; // 默认值为 'preload'
          const preloadTags = images.map((imgSrc) => ({
            tagName: 'link',
            voidTag: true,
            attributes: {
              rel: rel, // 使用配置中的 rel 值或默认值
              href: imgSrc,
              as: 'image',
            },
          }));

          htmlPluginData.head = htmlPluginData.head.concat(preloadTags);
          callback(null, htmlPluginData);
        }
      );
    });
  }

  getImages() {
    const imagesDir = path.resolve(__dirname, '../assets/images'); // 调整路径以匹配项目结构
    const files = fs.readdirSync(imagesDir);
    return files
      .filter(file => /\.(png|jpg|jpeg|gif|svg)$/.test(file))
      .map(file => `/assets/images/${file}`); // 转换为 Webpack 输出路径
  }
}

module.exports = PreloadImagesPlugin;
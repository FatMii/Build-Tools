const fs = require('fs');
const glob = require('glob');
const path = require('path');
const shelljs = require('shelljs');

class CustomCleanPlugin {
  constructor(opts) {
    this.options = opts;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('CustomCleanPlugin', async (compilation, callback) => {
      try {
        await this.findUnusedFiles(compilation, this.options);
        callback();
      } catch (error) {
        callback(error);
      }
    });
  }

  // 获取已使用的文件
  async collectUsedFiles(compilation) {
    const usedFilesSet = new Set(compilation.fileDependencies);
    const usedFiles = Array.from(usedFilesSet).filter(file => !file.includes('node_modules'));
    return usedFiles;
  }

  // 获取所有文件
  async getAllFiles(directoryPattern) {
    return new Promise((resolve, reject) => {
      glob(directoryPattern, { nodir: true }, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files.map(file => path.resolve(file)));
        }
      });
    });
  }

  filterExcludedFiles(excludedFiles, filesList) {
    return filesList.filter(file => {
      return !file.includes('node_modules') && !excludedFiles.some(excluded => file.includes(excluded));
    });
  }

  // 找出未使用的文件
  async findUnusedFiles(compilation, config) {
    const {
      rootDirectory = './src',
      shouldDelete = false,
      resultPath = './unused-files.json',
      excludedFiles = [] // 直接传入排除文件路径数组
    } = config;
    const filePattern = `${rootDirectory}/**/*`;
    try {
      const usedFiles = await this.collectUsedFiles(compilation);
      const allFiles = await this.getAllFiles(filePattern);
      let unusedFiles = allFiles.filter(file => !usedFiles.includes(file));
      if (excludedFiles.length > 0) {
        unusedFiles = this.filterExcludedFiles(excludedFiles, unusedFiles);
      }
      if (typeof resultPath === 'string') {
        fs.writeFileSync(resultPath, JSON.stringify(unusedFiles, null, 4));
      } else if (typeof resultPath === 'function') {
        resultPath(unusedFiles);
      }
      if (shouldDelete) {
        unusedFiles.forEach(file => {
          shelljs.rm(file);
          console.log(`Deleted file: ${file}`);
        });
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CustomCleanPlugin;
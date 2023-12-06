const fs = require("fs");
const options = require("./config.js");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");
class Compliter {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    // 模块
    this.modules = [];
  }

  // 构建启动
  run() {
    const info = this.build(this.entry);
    this.modules.push(info);
    this.modules.forEach(({ dependecies }) => {
      // 有依赖对象的话，递归解析所有依赖项
      if (dependecies) {
        for (const dependency in dependecies) {
          this.modules.push(this.build(dependecies[dependency]));
        }
      }
    });

    // console.log(this.modules);
    //生成依赖关系图
    const dependencyGraph = this.modules.reduce((graph, item) => {
      return {
        ...graph,
        [item.filename]: { dependcies: item.dependecies, code: item.code },
      };
    }, {});

    this.generate(dependencyGraph);
  }

  build(filename) {
    const { getAst, getDependecies, getCode } = Parser;
    const ast = getAst(filename);
    const dependecies = getDependecies(ast, filename);
    const code = getCode(ast);
    // console.log("===== AST =========");
    // console.log(JSON.stringify(ast, null, 2));
    // console.log("===== dependecies =========");
     console.log(JSON.stringify(dependecies, null, 2));
    // console.log("===== code =========");
    // console.log(JSON.stringify(code, null, 2));
    return {
      // 文件路径,可以作为每个模块的唯一标识符
      filename,
      // 依赖对象,保存着依赖模块路径
      dependecies,
      // 文件内容
      code,
    };
  }

  // 重写 require函数 (浏览器不能识别commonjs语法),输出bundle
  generate(code) {
    // 输出文件路径
    const filePath = path.join(this.output.path, this.output.filename);
    const bundle = `
      (function(graph){
        function require(module){
          function localRequire(relativePath){
            return require(graph[module].dependecies[relativePath])
          }
          var exports = {};
          (function(require,exports,code){
            eval(code)
          })(localRequire,exports,graph[module].code);
          return exports;
        }
        require('${this.entry}')
      })(${JSON.stringify(code)})
      `;
    // 把文件内容写入到文件系统
    fs.writeFileSync(filePath, bundle, "utf-8");
  }
}

const Parser = {
  getAst: (path) => {
    // 读取入口文件
    const content = fs.readFileSync(path, "utf-8");
    return parser.parse(content, {
      sourceType: "module",
    });
  },
  getDependecies: (ast, filename) => {
    const dependecies = {};
    // 遍历所有的 import 模块,存入dependecies
    traverse(ast, {
      // 类型为 ImportDeclaration 的 AST 节点 (即为import 语句)
      ImportDeclaration({ node }) {
        const dirname = path.dirname(filename);
        // 保存依赖模块路径,之后生成依赖关系图需要用到
        const filepath = "./" + path.join(dirname, node.source.value);
        dependecies[node.source.value] = filepath;
      },
    });
    return dependecies;
  },

  getCode: (ast) => {
    // AST转换为code
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });
    return code;
  },
};

new Compliter(options).run();

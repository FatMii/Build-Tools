
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
        require('./src/index.js')
      })({"./src/index.js":{"dependcies":{"./a.js":"./src\\a.js","./b.js":"./src\\b.js"},"code":"\"use strict\";\n\nvar _a = require(\"./a.js\");\nvar _b = require(\"./b.js\");\nconsole.log(\"\".concat(_b.name, \"\\u4ECA\\u5E74\").concat(_a.age, \"\\u5C81\\u4E86\"));"},"./src\\a.js":{"dependcies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.age = void 0;\nvar age = 18;\nexports.age = age;"},"./src\\b.js":{"dependcies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.name = void 0;\nvar name = \"张三\";\nexports.name = name;\nconsole.log(\"我是b.js文件\");"}})
      
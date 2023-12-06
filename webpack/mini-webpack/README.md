# 原理图解

1. 首先肯定是要先解析入口文件entry，将其转为AST(抽象语法树)，使用@babel/parser

2. 然后使用@babel/traverse去找出入口文件所有依赖模块

3. 然后使用 **@babel/core** +  @babel/preset-env将入口文件的AST转为Code

4. 将2中找到的入口文件的依赖模块，进行遍历递归，重复执行1，2，3

5. 重写require函数，并与4中生成的递归关系图一起，输出到bundle中



![Alt text](img/1.png)
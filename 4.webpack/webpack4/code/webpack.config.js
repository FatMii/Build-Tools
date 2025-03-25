const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//设置nodejs环境变量
//process.env.NODE_ENV = "development"
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "js/built.js",
        path: resolve(__dirname, 'build')
    },

    module: {
        rules: [
            //普通处理css方式,css会加入到js文件中
            /**
             * {
                 test: /\.css$/,
                 use: [
                     "style-loader",
                     //将css文件变成commonjs模块加载js,内容是样式字符串
                     "css-loader"
                 ]
             },  */
            {
                test: /\.css$/,
                use: [
                    //取代style-loader,提取js中的css成为单独文件
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    /*
                      css兼容性处理:postcss --> postcss-loader postcss-preset-env
                      帮postcss找到package.json中browserlist里面的配置,通过配置加载指定的css兼容性样式
                      
                       "browserslist": {
                         开发环境 --> 设置node环境变量:process.env.NODE_ENV = development
                         "development": [
                                "last 1 chrome version",
                                "last 1 firefox version",
                                "last 1 safari version"
                             ],

                         默认是生产环境
                        "production": [
                            ">0.2%",
                             "not dead",
                                "not op_mini all"
                            ]
                             }
                     */
                    //使用loader的默认配置
                    //'postcss-loader',
                    //修改loader的配置
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: () => [
                                //postcss的插件
                                require('postcss-preset-env')()
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader"
                }]
            },
            {
                test: /\.(jpg|png|gif)$/,
                loaders: 'url-loader',
                options: {
                    //减少请求数量(减轻服务器压力)
                    //缺点:图片体积更大(文件请求速度更慢)
                    limit: 8 * 1024,
                    //关闭url-loader的es6模块化,使用commonjs解析. 后续版本已解决,无需添加
                    //esModule: false
                    //给图片重命名,[ext]:取原来文件的文件类型
                    name: '[hash:10].[ext]',
                    outputPath: "imgs"
                }

            },
            {
                //处理html文件中的img图片
                test: /\.html$/,
                loaders: 'html-loader'
            },
            {
                //处理其他资源
                exclude: /\.(html|js|css|less|jpg|png|gif)/,
                loader: "file-loader",
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: "others"
                }
            },
            {
                /* js语法检查: eslint-loader eslint 
                   设置检查规则:
                      package.jsonzhong eslintConfig中设置
                          "eslintConfig": {
                                "extends": "airbnb-base"
                            }

                      airbnb --> eslint-config-airbnb-base eslint-plugin-import eslint
                */
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    //自动修复
                    fix: true
                }
            },
            /**
             * js兼容性处理: babel-loader @babel/core @babel/preset-env
             * 1.基本兼容性处理 --> @babel/preset-env  只能转换基本语法,如promise不能转换
             * 2.全部js兼容性处理 --> @babel/polyfill   所有兼容性代码全部引入,体积太大
             * 3.按需加载 --> core-js
             */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    //预设:指示babel做怎么样的兼容性处理
                    presets: [
                        ['@babel/preset-env',
                            {
                                //按需加载
                                useBuiltIns: "usage",
                                corejs: {
                                    version: 3
                                },
                                //指定兼容性具体到哪个版本浏览器
                                targets: {
                                    chrome: "60",
                                    firefox: "60",
                                    ie: "9",
                                    safari: "10",
                                    edge: "17"
                                }
                            }
                        ]
                    ]
                }
            }

        ]
    },

    plugins: [
        //功能:默认创建一个html,引入打包输出的所有资源(js/css)
        new HtmlWebpackPlugin({
            //复制 './src/index.html',并自动引入打包输出的所有资源(js/css)
            template: "./src/index.html",
            //html压缩
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        //从js中分割出独立的css
        new MiniCssExtractPlugin({
            filename: "css/main.css"
        }),
        //css压缩
        new OptimizeCssAssetsWebpackPlugin(),
        //自动清除旧的打包文件
        new CleanWebpackPlugin()
    ],

    mode: "development",
    //将mode改为production会启动js压缩
    //mode:"production",

    //开发服务器 devServer:自动化编译,自动化打开浏览器,自动刷新浏览器
    //只会在内存中编译打包,不会有任何输出
    //启动devServe命令:npx web-dev-server
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        compress: true,
        port: 3000,
        open: true
    }
}
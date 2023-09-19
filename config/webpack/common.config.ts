import * as path from "path";
import * as webpack from "webpack";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

import * as JSON5 from "json5";
import util from "./util";
import { jsExternals, cssExternals } from "./externals";
const isDevMode = process.env.NODE_ENV === "development";

/**
 * 在[dev/prod.config.js]中公用的配置
 */
const commonConfig: webpack.Configuration = {
  entry: {
    index: util.entry,
  },
  output: {
    filename: `js/${util.hash}.js`,
    path: util.outdir,

    // 如果发布第三方包
    // https://webpack.js.org/configuration/output/#outputlibrary
    library: {
      // name: "packageName",

      // 库类型
      // https://webpack.js.org/configuration/output/#outputlibrarytype
      // 设置为 module 会输出esm，则不能设置name，还需要开启experiments.outputModule
      type: "umd",
    },

    // https://webpack.js.org/configuration/output/#outputpublicpath
    publicPath: "/",

    // 清理dist
    clean: true,
  },
  module: {
    rules: [
      {
        // See also: https://github.com/microsoft/TypeScript-Babel-Starter
        // 如果你想要.d.ts文件，那么ts-loader可能来的更直接点
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: isDevMode
          ? [
              {
                // https://www.npmjs.com/package/swc-loader
                // https://swc.rs/docs/configuring-swc
                loader: "swc-loader",
                options: {
                  jsc: {
                    parser: {
                      syntax: "typescript",
                      tsx: true,
                      dynamicImport: true,
                      decorators: true,
                    },
                    transform: {
                      legacyDecorator: true,
                      decoratorMetadata: true,
                    },
                    keepClassNames: true,
                    target: "es2021",
                    loose: true,
                  },
                },
              },
            ]
          : [
              {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/env"],
                  plugins: [
                    [
                      "import",
                      {
                        libraryName: "lodash",
                        libraryDirectory: "",
                        camel2DashComponentName: false,
                      },
                      "lodash",
                    ],
                    [
                      "import",
                      {
                        libraryName: "antd",
                        libraryDirectory: "lib",
                      },
                      "antd",
                    ],
                  ],
                },
              },
              {
                // https://github.com/TypeStrong/ts-loader
                loader: "ts-loader",
                options: {
                  transpileOnly: isDevMode, // 关闭类型检查
                  configFile: path.join(
                    util.rootPath,
                    process.env.NODE_ENV === "production"
                      ? "tsconfig.types.json"
                      : "tsconfig.json"
                  ),
                },
              },
            ],
      },
      {
        test: /\.css$/i,
        use: util.cssLoader,
      },
      {
        test: /\.s[ac]ss$/i,
        use: util.sassLoader,
      },
      {
        // https://webpack.js.org/guides/asset-modules/
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: isDevMode ? "asset/resource" : "asset", // 小于 8kb 的文件将被视为 inline, 否则 resource
        generator: {
          filename: `images/${util.hash}[ext][query]`,
        },
        // parser: {
        //   dataUrlCondition: {
        //     maxSize: 10 * 1024, // 10kb
        //   },
        // },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: `fonts/${util.hash}[ext][query]`,
        },
      },
      {
        test: /\.txt/,
        type: isDevMode ? "asset/resource" : "asset",
      },

      // 自定义加载器
      // https://webpack.js.org/guides/asset-management/#customize-parser-of-json-modules
      {
        test: /\.json5$/i,
        type: "json",
        parser: {
          parse: JSON5.parse,
        },
      },
    ],
  },

  resolve: {
    // 导入此类文件时，不用添加文件后缀
    extensions: [".tsx", ".ts", ".js"],

    // 如果要配置路径别名，就在/tsconfig.json里面配置
    alias: util.alias,

    // 正常解析失败时重定向模块请求
    fallback: {
      // 假如你编写的包，相同时打包在浏览器和node的环境下运行，你的源码中包含了node的fs模块，但是在浏览器不存在fs模块，这时候你需要配置这个选项
      // fs: false,
      path: "path-browserify",
    },
  },

  // 插件: https://webpack.js.org/configuration/plugins/#plugins
  plugins: [
    // 将 CSS 提取到单独的文件中
    // https://webpack.js.org/plugins/mini-css-extract-plugin/
    new MiniCssExtractPlugin({
      filename: `css/${util.hash}.css`,
      chunkFilename: "[id].css",
    }),

    // 生成一个 HTML5 文件
    // https://github.com/jantimon/html-webpack-plugin#options
    // https://ejs.co/#install
    new HtmlWebpackPlugin({
      inject: false, // 不自动注入，在html中编写脚本设置注入位置
      title: "webpack scaffold",
      template: util.htmlTemplatePath,
      outputModule: isDevMode,
      js_cnd: isDevMode ? [] : util.externals2Cdn(jsExternals),
      css_cnd: isDevMode ? [] : util.externals2Cdn(cssExternals),
    }),

    // https://webpack.js.org/guides/progressive-web-application/
    // new WorkboxPlugin.GenerateSW({
    //   clientsClaim: true,
    //   skipWaiting: true,
    // }),

    // 将 /public 拷贝到/dist/public
    // https://webpack.js.org/plugins/copy-webpack-plugin/
    new CopyPlugin({
      patterns: [
        {
          from: path.relative(util.rootPath, "public"),
          to: "public",
        },
      ],
    }),

    // 使用交互式可缩放树图可视化 webpack 输出文件的大小
    // new BundleAnalyzerPlugin(),
  ],

  // 实验性支持: https://webpack.js.org/configuration/experiments/
  experiments: {
    topLevelAwait: true,
    outputModule: isDevMode,
  },

  // 打包时显示哪些信息
  // https://webpack.js.org/configuration/stats/
  stats: "summary",
};

export default commonConfig;

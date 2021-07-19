import * as path from "path";
import * as webpack from "webpack";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
import * as JSON5 from "json5";
import util from "./util";
import { jsExternals, cssExternals } from "./externals";
const isDevMode = process.env.NODE_ENV === "development";

/**
 * 在[dev/prod.config.js]中公用的配置
 */
const commonConfig: webpack.Configuration = {
  entry: {
    main: util.entry,
  },
  output: {
    filename: `js/${util.hash}.js`,
    path: util.output,

    // 如果发布第三方包，可以启动下面这三个配置
    // library: "packageName",
    libraryTarget: "umd",
    globalObject: "this",

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
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/env", "@babel/typescript"],
              plugins: [
                ...[
                  "@babel/plugin-transform-runtime",
                  ["@babel/plugin-proposal-decorators", { legacy: true }],
                  ["@babel/plugin-proposal-class-properties", { loose: true }],
                  ["@babel/plugin-proposal-private-methods", { loose: true }],
                  "@babel/proposal-object-rest-spread",
                ],
                ...(isDevMode
                  ? [
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
                    ]
                  : []),
              ],
            },
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true, // 编译时关闭类型检查，依赖编辑器做类型检查
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
        use: [
          isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          {
            // https://webpack.js.org/loaders/postcss-loader/
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  ["postcss-short", {}], // CSS中使用高级速记属性
                  [
                    "postcss-preset-env",
                    {}, // 将现代CSS转换为大多数浏览器可以理解的内容
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          {
            // https://webpack.js.org/loaders/postcss-loader/
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  ["postcss-short", {}], // CSS中使用高级速记属性
                  [
                    "postcss-preset-env",
                    {}, // 将现代CSS转换为大多数浏览器可以理解的内容
                  ],
                ],
              },
            },
          },
          {
            // https://webpack.js.org/loaders/sass-loader/
            loader: "sass-loader",
            options: {
              // 全局配置
              // @use: https://sass-lang.com/documentation/at-rules/use
              additionalData: `
              $isDevMode: ${isDevMode}
              ${isDevMode ? '@use "~antd/dist/antd"' : ""}
              @use "stylus.sass" as *
              `,
              sassOptions: {
                includePaths: [util.rootPath],
              },
            },
          },
        ],
      },
      {
        // https://webpack.js.org/guides/asset-modules/
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset", // 小于 8kb 的文件将被视为 inline, 否则 resource
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
        type: "asset",
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

  // 外部依赖项 需要插入到打包后的html文件中的cdn
  // https://webpack.js.org/configuration/externals/
  externals: isDevMode ? {} : jsExternals,
  resolve: {
    // 导入此类文件时，不用添加文件后缀
    extensions: [".tsx", ".ts", ".js"],

    // 如果要配置路径别名，就在/tsconfig.json里面配置
    alias: util.alias,

    // 正常解析失败时重定向模块请求
    fallback: {
      // 假如你编写的包，相同时打包在浏览器和node的环境下运行，你的源码中包含了node的fs模块，但是在浏览器不存在fs模块，这时候你需要配置这个选项
      // fs: false,
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
    new HtmlWebpackPlugin({
      inject: false, // 不自动注入，在html中编写脚本设置注入位置
      title: "webpack-scaffold",
      template: util.htmlTemplatePath,
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
  ],

  // 实验性支持: https://webpack.js.org/configuration/experiments/
  experiments: {
    topLevelAwait: true,
  },
};

export default commonConfig;

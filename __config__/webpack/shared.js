const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const CopyFilePlugin = require("webpack-copy-file-plugin");

const util = require("./util");
const packageConfig = require("../../package.json");

const isDevMode = process.env.NODE_ENV === "development";

// 外部依赖，不会创建捆绑包
// https://webpack.js.org/configuration/externals/
const externals = {
  lodash: {
    cdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/lodash.js/${version}/lodash.min.js`,
    root: "_",
    commonjs2: "_",
    commonjs: "_",
    amd: "_",
  },
};

/**
 * 在[dev/prod.config.js]中公用的配置
 */
module.exports = {
  entry: {
    main: util.entry(),
  },
  output: {
    filename: "js/[name].[contenthash:8].js",
    path: util.output(),

    // 如果发布第三方包，可以启动下面这三个配置
    // library: "packageName",
    libraryTarget: "umd",
    globalObject: "this",

    // <img src="./x.png" />
    publicPath: "",

    // <img src="/static/x.png" />
    // publicPath: '/static/',
  },

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
              "@babel/plugin-transform-runtime",
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              ["@babel/plugin-proposal-private-methods", { loose: true }],
              "@babel/proposal-object-rest-spread",
              [
                "import",
                {
                  libraryName: "lodash",
                  libraryDirectory: "",
                  camel2DashComponentName: false,
                },
                "lodash",
              ],
            ],
          },
        },
        {
          loader: "ts-loader",
          options: {
            configFile: path.join(
              util.rootPath(),
              process.env.NODE_ENV === "production"
                ? "tsconfig.build.json"
                : "tsconfig.json"
            ),
          },
        },
      ],
    },
    {
      test: /\.styl$/,
      use: [
        // 该插件将CSS提取到单独的文件中
        // https://webpack.js.org/plugins/mini-css-extract-plugin/
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
          // https://www.npmjs.com/package/stylus-loader
          loader: "stylus-loader",
          options: {
            stylusOptions: {
              // 导入styl全局配置
              import: [path.join(__dirname, "../../stylus.styl")],
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
            additionalData: '@import "stylus.scss";',
            sassOptions: {
              includePaths: [path.resolve(__dirname, "../../")],
            },
          },
        },
      ],
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        {
          // https://webpack.js.org/loaders/file-loader/
          loader: "file-loader",
          options: {
            outputPath: "images",
            name: "[name].[ext]",
          },
        },
      ],
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            outputPath: "fonts",
            name: "[name].[ext]",
          },
        },
      ],
    },
    {
      test: /\.(csv|tsv)$/,
      use: ["csv-loader"],
    },
    {
      test: /\.xml$/,
      use: ["xml-loader"],
    },
    // {
    //   test: /\.html$/,
    //   exclude: [/node_modules/, path.resolve(__dirname, "index.html")],
    //   use: { loader: "html-loader" }
    // }
  ],

  // 需要插入到打包后的html文件中的cdn
  externals: externals,
  resolve: {
    // 导入此类文件时，不用添加文件后缀
    extensions: [".tsx", ".ts", ".js"],

    // 如果要配置路径别名，就在/tsconfig.json里面配置
    alias: {
      ...util.alias(),
    },

    // 正常解析失败时重定向模块请求
    fallback: {
      // 假如你编写的包，相同时打包在浏览器和node的环境下运行，你的源码中包含了node的fs模块，但是在浏览器不存在fs模块，这时候你需要配置这个选项
      // fs: false,
    },
  },

  // 优化: https://webpack.js.org/configuration/optimization/
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), // 仅在生产模式下启用 CSS 优化
    ],
  },

  // 插件: https://webpack.js.org/configuration/plugins/#plugins
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      title: "webpack-scaffold",
      template: util.htmlTemplatePath(),
      cnd: util.externals2Cdn(externals, packageConfig.dependencies),
    }),

    // 将 /public 拷贝到打包后的文件夹下
    new CopyFilePlugin(
      ["./public/"].map((fpath) => {
        return path.resolve(__dirname, "../../", fpath);
      })
    ),
  ],

  // 实验性支持: https://webpack.js.org/configuration/experiments/
  experiments: {
    topLevelAwait: true,
  },
};

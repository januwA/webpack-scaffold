const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const util = require("./util");
const tsConfig = require("../../tsconfig.json");
const packageConfig = require("../../package.json");

const isDevMode = process.env.NODE_ENV === "development";
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
    main: util.getEntryMain(),
  },
  output: {
    filename: "[name]-[hash].js",
    path: util.getOutputPath(tsConfig),

    // 如果发布第三方包，可以启动下面这三个配置
    // library: "packageName",
    libraryTarget: "umd",
    globalObject: "this",

    // <img src="./x.png" />
    // publicPath: './',

    // <img src="./static/x.png" />
    // publicPath: './static',
  },

  rules: [
    {
      // See also: https://github.com/microsoft/TypeScript-Babel-Starter
      // 如果你想要.d.ts文件，那么ts-loader可能来的更直接点
      test: /\.tsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/env", "@babel/typescript"],
          plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
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
    },
    {
      test: /\.styl$/,
      use: [
        // 该插件将CSS提取到单独的文件中
        // https://webpack.js.org/plugins/mini-css-extract-plugin/
        isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
        { loader: "css-loader", options: { importLoaders: 1 } },
        // {
        //   loader: "postcss-loader",
        //   options: {
        //     // https://webpack.js.org/loaders/postcss-loader/
        //     ident: "postcss",
        //     plugins: (loader) => [
        //       require("postcss-import")({ root: loader.resourcePath }),
        //       require("postcss-preset-env")(),
        //       require("cssnano")(),
        //       require("autoprefixer")(),
        //     ],
        //   },
        // },
        { loader: "stylus-loader" },
      ],
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: ["file-loader"],
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ["file-loader"],
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
    // 导入此类文件时，不用添加后缀
    extensions: [".tsx", ".ts", ".js"],

    // 如果要配置路径别名，就在/tsconfig.json里面配置
    alias: {
      ...util.parseTsConfigPaths(tsConfig),
    },
  },
  optimization: {},
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      title: "webpack-scaffold",
      template: util.getHtmlTemplatePath(),
      cnd: util.externals2Cdn(externals, packageConfig.dependencies),
    }),
  ],
};

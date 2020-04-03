const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyFilePlugin = require("webpack-copy-file-plugin");

// 最小化生产
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const util = require("./util");
const tsConfig = require("../../tsconfig.json");
const packageConfig = require("../../package.json");

const externals = {
  lodash: {
    cdn: version =>
      `https://cdnjs.cloudflare.com/ajax/libs/lodash.js/${version}/lodash.min.js`,
    root: "_",
    commonjs2: "_",
    commonjs: "_",
    amd: "_"
  }
};

/**
 * 在[dev/prod.config.js]中公用的配置
 */
const sharedConfig = {
  entry: {
    main: util.getEntryMain()
  },
  output: {
    filename: "[name]-[hash].js",
    path: util.getOutputPath(tsConfig),

    // 如果发布第三方包，可以启动下面这三个配置
    // library: "packageName",
    libraryTarget: "umd",
    globalObject: "this"

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
                camel2DashComponentName: false
              },
              "lodash"
            ]
          ]
        }
      }
    },
    {
      test: /\.css$/,
      use: [
        "style-loader",
        { loader: "css-loader", options: { importLoaders: 1 } },
        {
          loader: "postcss-loader",
          options: {
            ident: "postcss",
            sourceMap: true,
            exec: true,
            plugins: loader => [
              require("postcss-import")({ root: loader.resourcePath }),
              require("postcss-preset-env")(),
              require("cssnano")()
            ]
          }
        }
      ]
    },
    {
      test: /\.styl$/,
      use: [
        MiniCssExtractPlugin.loader,
        { loader: "css-loader", options: { importLoaders: 1 } },
        "stylus-loader"
      ]
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: ["file-loader"]
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ["file-loader"]
    },
    {
      test: /\.(csv|tsv)$/,
      use: ["csv-loader"]
    },
    {
      test: /\.xml$/,
      use: ["xml-loader"]
    }
    // {
    //   test: /\.html$/,
    //   exclude: [/node_modules/, path.resolve(__dirname, "index.html")],
    //   use: { loader: "html-loader" }
    // }
  ],

  // 需要插入到打包后的html文件中的cdn
  externals: externals,
  resolve: {
    extensions: [".tsx", ".ts", ".js"],

    // 如果要配置路径别名，就在/tsconfig.json里面配置
    alias: {
      ...util.parseTsConfigPaths(tsConfig)
    }
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name]-[hash].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      inject: false,
      title: "webpack-scaffold",
      template: util.getHtmlTemplatePath(),
      cnd: util.externals2Cdn(externals, packageConfig.dependencies)
    })
    // new CopyFilePlugin(["./README.md"].map(f => path.resolve(__dirname, f)))
  ]
};

module.exports = sharedConfig;

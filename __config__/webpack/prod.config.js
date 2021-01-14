process.env.NODE_ENV = "production";

// 最小化生产
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CopyFilePlugin = require("webpack-copy-file-plugin");

const shared = require("./shared");

module.exports = {
  // target: 'node' // 如果你只想打包在nodejs环境中运行的代码，就开启这个
  mode: process.env.NODE_ENV,
  entry: shared.entry,
  externals: shared.externals,
  module: {
    rules: shared.rules,
  },
  resolve: shared.resolve,
  optimization: {
    // 压缩js,css文件
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    // 删除空的块
    removeEmptyChunks: true,
    // 合并包含相同模块的块
    mergeDuplicateChunks: true,
  },
  plugins: [
    ...shared.plugins,
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
      chunkFilename: "[id].css",
    }),
    // new CopyFilePlugin(["./README.md"].map(f => path.resolve(__dirname, f)))
  ],
  output: shared.output,
  experiments: shared.experiments,
};

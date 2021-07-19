import * as webpack from "webpack";
import { merge } from "webpack-merge";
import commonConfig from "./common.config";

const devConfig: webpack.Configuration = merge(commonConfig, {
  // target: 'node', // 如果你只想打包在nodejs环境中运行的代码，就开启这个
  mode: process.env.NODE_ENV as "development",
  devtool: "inline-source-map", // 生成map文件

  // 开发时构建优化: https://webpack.js.org/configuration/optimization/
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
});

export default [devConfig];

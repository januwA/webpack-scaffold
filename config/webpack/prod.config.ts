import * as webpack from "webpack";
import { merge } from "webpack-merge";
import CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
import commonConfig from "./common.config";

const prodConfig: webpack.Configuration = merge(commonConfig, {
  // target: 'node', // 如果你只想打包在nodejs环境中运行的代码，就开启这个
  mode: "production",

  output: {
    // 开发模式使用esbuild，不能配置这个属性
    globalObject: "this",
  },

  // 生产优化: https://webpack.js.org/configuration/optimization/
  optimization: {
    minimizer: ["...", new CssMinimizerPlugin()],

    // 摇树
    // https://webpack.js.org/guides/tree-shaking/
    usedExports: true,
  },
});

export default [prodConfig];

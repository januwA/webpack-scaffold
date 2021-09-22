import * as webpack from "webpack";
import { merge } from "webpack-merge";
import CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
import * as TerserPlugin from "terser-webpack-plugin";
import commonConfig from "./common.config";
import { jsExternals } from "./externals";

const prodConfig: webpack.Configuration = merge(commonConfig, {
  // target: 'node', // 如果你只想打包在nodejs环境中运行的代码，就开启这个
  mode: "production",


  // 外部依赖项 需要插入到打包后的html文件中的cdn
  // https://webpack.js.org/configuration/externals/
  externals: jsExternals,

  output: {
    // 开发模式使用esbuild，不能配置这个属性
    globalObject: "this",
  },

  // 生产优化: https://webpack.js.org/configuration/optimization/
  optimization: {
    minimize: true,
    minimizer: ["...", new TerserPlugin(), new CssMinimizerPlugin()],

    // 摇树
    // https://webpack.js.org/guides/tree-shaking/
    usedExports: true,
  },
});

export default [prodConfig];

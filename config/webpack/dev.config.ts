import * as webpack from "webpack";
import { merge } from "webpack-merge";
import commonConfig from "./common.config";
import * as SpeedMeasurePlugin from "speed-measure-webpack-plugin";

const devConfig: webpack.Configuration = merge(commonConfig, {
  // target: 'node', // 如果你只想打包在nodejs环境中运行的代码，就开启这个
  mode: "development",

  // https://webpack.js.org/configuration/cache/
  cache: {
    type: "filesystem",
  },
  output: {
    environment: {
      dynamicImport: true,
      module: true,
    },
    // 将 JavaScript 文件输出为esm
    // https://webpack.js.org/configuration/output/#outputmodule
    // module: true,
    // chunkLoading: "import",
    // chunkFormat: "module",
  },

  // https://webpack.js.org/configuration/devtool/#devtool
  // 选择一种源映射样式来增强调试过程。这些值会显着影响构建和重建速度
  devtool: "eval",

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
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
    }),
  ],
});

// const smp = new SpeedMeasurePlugin();
// export default [smp.wrap(devConfig)];
export default [devConfig];

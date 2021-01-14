process.env.NODE_ENV = "development";

const shared = require("./shared");

module.exports = {
  // target: 'node' // 如果你只想打包在nodejs环境中运行的代码，就开启这个
  mode: process.env.NODE_ENV,
  entry: shared.entry,
  externals: shared.externals,
  devtool: "inline-source-map", // 生成map文件
  module: {
    rules: shared.rules,
  },
  resolve: shared.resolve,
  optimization: shared.optimization,
  plugins: shared.plugins,
  output: shared.output,
  experiments: shared.experiments,
};

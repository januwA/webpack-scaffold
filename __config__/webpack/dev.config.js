const shared = require("./shared");

process.env.NODE_ENV = "development";

module.exports = {
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
};

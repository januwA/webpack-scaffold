const shared = require("./shared");

module.exports = {
  mode: "development",
  entry: shared.entry,
  externals: shared.externals,
  devtool: "inline-source-map", // 生成map文件
  module: {
    rules: shared.rules
  },
  resolve: shared.resolve,
  optimization: shared.optimization,
  plugins: shared.plugins,
  output: shared.output
};

const shared = require("./shared");

process.env.NODE_ENV = "production";

module.exports = {
  mode: process.env.NODE_ENV,
  entry: shared.entry,
  externals: shared.externals,
  module: {
    rules: shared.rules,
  },
  resolve: shared.resolve,
  optimization: shared.optimization,
  plugins: shared.plugins,
  output: shared.output,
};

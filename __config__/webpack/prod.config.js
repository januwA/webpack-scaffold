const shared = require("./shared");

module.exports = {
  mode: "production",
  entry: shared.entry,
  externals: shared.externals,
  module: {
    rules: shared.rules
  },
  resolve: shared.resolve,
  optimization: shared.optimization,
  plugins: shared.plugins,
  output: shared.output
};

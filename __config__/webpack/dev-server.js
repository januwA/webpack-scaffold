const path = require("path");
const webpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const util = require("./util");

const config = require("./dev.config");
const tsConfig = require("../../tsconfig.json");

const contentBase = util.getOutputPath(tsConfig);
// https://webpack.js.org/configuration/dev-server
const options = {
  contentBase,
  index: "index.html",
  openPage: "",
  host: "localhost",
  open: true, // 默认打开浏览器
  port: 5000,
  writeToDisk: true,
  compress: true,
  overlay: {
    // warnings: true,
    errors: true
  },

  // 现在有个/api/users的请求会将请求代理到http://localhost:3000/api/users
  // proxy: {
  //   '/api': 'http://localhost:3000/'
  // },

  after(app, server, compiler) {
    // 拦截路由
    // 
    // See also:
    // https://gkedge.gitbooks.io/react-router-in-the-real/content/node_express.html
    // https://expressjs.com/zh-cn/4x/api.html#req
    app.get("*", (req, res, next) => {
      res.sendFile(path.join(contentBase, "index.html"));
    });
  }
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(options.port, options.host, () => {
  console.log(`dev server listening on port ${options.port}`);
});

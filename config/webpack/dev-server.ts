import * as webpack from "webpack";
import * as webpackDevServer from "webpack-dev-server";

const isDevMode = process.env.NODE_ENV == "development";

import devConfig from "./dev.config";
import prodConfig from "./prod.config";

const webpackConfig = isDevMode ? devConfig : prodConfig;

// https://webpack.js.org/configuration/dev-server
const options: webpackDevServer.Configuration = {
  stats: "errors-only",
  open: true, // 默认打开浏览器
  host: "localhost",
  port: 4000, // 默认打开的端口
  writeToDisk: true, // 结果输出到磁盘
  compress: true,
  historyApiFallback: true,
  overlay: {
    // warnings: true,
    errors: true,
  },

  // 现在有个 /api/test 的请求会将请求代理到 http://localhost:3000/api/test
  // https://webpack.js.org/configuration/dev-server/#devserverproxy
  proxy: {
    "/api": {
      target: "http://localhost:3000",
      secure: false,
      changeOrigin: true,
    },
  },
};

webpackDevServer.addDevServerEntrypoints(webpackConfig as any, options);
const compiler: any = webpack(webpackConfig);
const server = new webpackDevServer(compiler, options);

server.listen(options.port, options.host, () => {
  console.log(`dev server listening ${options.host}:${options.port}`);
});

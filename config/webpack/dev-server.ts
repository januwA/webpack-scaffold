import * as webpack from "webpack";
import * as DevServer from "webpack-dev-server";

const isDevMode = process.env.NODE_ENV == "development";

import devConfig from "./dev.config";
import prodConfig from "./prod.config";

const webpackConfig = isDevMode ? devConfig : prodConfig;

// https://webpack.js.org/configuration/dev-server
const options: DevServer.Configuration = {
  open: false, // 默认打开浏览器
  host: "localhost",
  port: 4000, // 默认打开的端口
  compress: true,
  historyApiFallback: true,
  devMiddleware: {
    stats: "errors-only",
    writeToDisk: true, // 结果输出到磁盘
  },
  client: {
    overlay: {
      // warnings: true,
      errors: true,
    },
  },
  // 现在有个 /api/test 的请求会将请求代理到 http://localhost:3000/api/test
  // https://webpack.js.org/configuration/dev-server/#devserverproxy
  proxy: {
    "/users": {
      target: "http://localhost:8000",
      secure: false,
      changeOrigin: true,
    },
  },
};

const compiler: any = webpack(webpackConfig);
const server = new DevServer(options, compiler);

(async () => {
  await server.start();
})();

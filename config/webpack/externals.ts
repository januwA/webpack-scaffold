// 外部依赖，不会创建捆绑包
// https://webpack.js.org/configuration/externals/
export const jsExternals = {
  lodash: {
    cdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/lodash.js/${version}/lodash.min.js`,
    root: "_",
    commonjs2: "_",
    commonjs: "_",
    amd: "_",
  },
  react: {
    cdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/react/${version}/umd/react.production.min.js`,
    root: "React",
    commonjs2: "React",
    commonjs: "React",
    amd: "React",
  },
  "react-dom": {
    cdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/react-dom/${version}/umd/react-dom.production.min.js`,
    root: "ReactDOM",
    commonjs2: "ReactDOM",
    commonjs: "ReactDOM",
    amd: "ReactDOM",
  },
  "react-router-dom": {
    cdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/${version}/react-router-dom.min.js`,
    root: "ReactRouterDOM",
    commonjs2: "ReactRouterDOM",
    commonjs: "ReactRouterDOM",
    amd: "ReactRouterDOM",
  },
  antd: {
    cdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/antd/${version}/antd.min.js`,
    root: "antd",
    commonjs2: "antd",
    commonjs: "antd",
    amd: "antd",
  },
  axios: {
    cdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/axios/${version}/axios.min.js`,
    root: "axios",
    commonjs2: "axios",
    commonjs: "axios",
    amd: "axios",
  },
  rxjs: {
    cdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/rxjs/${version}/rxjs.umd.min.js`,
    root: "rxjs",
    commonjs2: "rxjs",
    commonjs: "rxjs",
    amd: "rxjs",
  },
  "react-rxbuilder": {
    cdn: (version) =>
      `https://unpkg.com/react-rxbuilder@${version}/dist/react-rxbuilder.js`,
    root: "ReactRxBuilder",
    commonjs2: "ReactRxBuilder",
    commonjs: "ReactRxBuilder",
    amd: "ReactRxBuilder",
  },
};

export const cssExternals = {
  antd: {
    cdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/antd/${version}/antd.min.css`,
  },
};

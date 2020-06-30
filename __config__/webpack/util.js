const path = require("path");

class Util {
  /**
   * 返回项目根目录
   */
  getRootPath() {
    return path.resolve(__dirname, "../../");
  }

  /**
   * 返回打包入口文件路径
   */
  getEntryMain() {
    return path.resolve(this.getRootPath(), "src/index.ts");
  }

  getOutputPath(tsConfig) {
    const out = tsConfig ? tsConfig.compilerOptions.outDir : "dist";
    return path.resolve(this.getRootPath(), out);
  }

  /**
   * 返回[HtmlWebpackPlugin]插件的[template]配置路径
   */
  getHtmlTemplatePath() {
    return path.resolve(this.getRootPath(), "index.html");
  }

  /**
   * 解析[tsconfig.json]中的paths配置，并返回一个能在webpack中使用的[alias]
   *
   * input:
   * ```json
   * {
   * 	"compilerOptions": {
   * 		"paths": {
   * 			"~src/*": [
   * 				"./src/*"
   * 			],
   * 			"~assets/*": [
   * 				"./src/assets/*"
   * 			]
   * 		}
   * 	}
   * }
   * ```
   *
   * output:
   * ```
   * {
   *   "~src": "./src",
   *   "~assets": "./src/assets",
   * }
   * ```
   *
   * @param {} tsConfig
   */
  parseTsConfigPaths(tsConfig) {
    const { paths, baseUrl } = tsConfig.compilerOptions;
    const alias = {};
    if (paths) {
      const rootPath = this.getRootPath();
      const exp = /\/\*$/;
      for (const aliasPath in paths) {
        const key = aliasPath.replace(exp, "");
        const value = paths[aliasPath][0].replace(exp, "");
        alias[key] = path.resolve(rootPath, baseUrl, value);
      }
    }
    return alias;
  }

  /**
   *
   * @param {*} externals webpack的[externals]配置
   * @param {*} dependencies package.js中的[dependencies]字段
   */
  externals2Cdn(externals, dependencies) {
    const result = [];
    for (const libKey in externals) {
      if (libKey in dependencies) {
        const version = dependencies[libKey].replace(/^\D/, "");
        result.push(externals[libKey].cdn(version));
      }
    }
    return result;
  }
}
const util = new Util();
module.exports = util;

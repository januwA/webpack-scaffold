import * as path from "path";
import * as fs from "fs";
import * as JSON5 from "json5";
import * as packageConfig from "../../package.json";
import MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDevMode = process.env.NODE_ENV === "development";

class Util {
  /**
   * 读取 tsconfig.json的配置
   */
  static _tsconfig = null;
  get tsconfig(): any {
    if (Util._tsconfig) return Util._tsconfig;
    return (Util._tsconfig = JSON5.parse(
      fs.readFileSync(path.resolve(this.rootPath, "tsconfig.json"), {
        encoding: "utf-8",
      })
    ));
  }

  /**
   * 返回项目根目录
   */
  static _rootPath = null;
  get rootPath(): string {
    if (Util._rootPath) return Util._rootPath;
    return (Util._rootPath = path.resolve(__dirname, "../../"));
  }

  /**
   * 返回打包入口文件路径
   */
  get entry(): string {
    return path.resolve(this.rootPath, "src", "index");
  }

  /**
   * 打包输出目录
   */
  get outdir(): string {
    const out = this.tsconfig ? this.tsconfig.compilerOptions.outDir : "dist";
    return path.resolve(this.rootPath, out /*, "umd" */);
  }

  /**
   * 返回[HtmlWebpackPlugin]插件的[template]配置路径
   */
  get htmlTemplatePath() {
    return path.resolve(this.rootPath, "index.html");
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
   */
  get alias() {
    const { paths = {}, baseUrl = './' } = this.tsconfig.compilerOptions;
    const alias = {};
    if (paths) {
      const rootPath = this.rootPath;
      const exp = /\/\*$/;
      for (const aliasPath in paths) {
        const key = aliasPath.replace(exp, "");
        const values: string[] = paths[aliasPath];
        alias[key] = values.map((val) =>
          path.resolve(rootPath, baseUrl, val.replace(exp, ""))
        );
      }
    }

    return alias;
  }

  /**
   *
   * @param {*} externals webpack的[externals]配置
   * @param {*} dependencies package.js中的[dependencies]字段
   */
  externals2Cdn(externals): string[] {
    if (!packageConfig.dependencies) return [];

    const result = [];
    for (const libKey in externals) {
      if (libKey in packageConfig.dependencies) {
        const version = packageConfig.dependencies[libKey].replace(/^\D/, "");
        result.push(externals[libKey].cdn(version));
      }
    }
    return result;
  }

  // 开发模式下 contenthash 没有任何意义
  get hash(): string {
    return process.env.NODE_ENV === "production" ? "[contenthash:8]" : "[name]";
  }

  get cssLoader(): any[] {
    const use: any[] = [];
    use.push({
      loader: isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
    });
    use.push({ loader: "css-loader" });
    if (!isDevMode) {
      use.push({
        // https://webpack.js.org/loaders/postcss-loader/
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: [
              //  将现代CSS转换为大多数浏览器可以理解的内容
              // https://github.com/csstools/postcss-preset-env
              ["postcss-preset-env", {}],
            ],
          },
        },
      });
    }
    return use;
  }

  get sassLoader(): any[] {
    const use: any[] = [
      ...this.cssLoader,
      {
        // https://webpack.js.org/loaders/sass-loader/
        loader: "sass-loader",
        options: {
          // 全局配置
          // @use: https://sass-lang.com/documentation/at-rules/use
          // 开发时导入antd的css
          additionalData: `
              ${isDevMode ? '@use "~antd/dist/antd"' : ""}
              @use "stylus.sass" as *
              `,
          sassOptions: {
            includePaths: [this.rootPath],
          },
        },
      },
    ];

    return use;
  }
}
const util = new Util();
export default util;

import _ from "lodash";

import "~src/main.styl";
import Img from "~assets/image.jpg";
import jsonData from "~assets/data.json";

document.querySelector<HTMLImageElement>("img#js-img")!.src = Img;
console.log(jsonData);
console.log(_.toUpper("ajanuw"));

console.log(await Promise.resolve("top await"));

let a;
a ??= "asd";
console.log(a);

const exp = /\s*(?<typedef>typedef)?\s*(?<struct>struct)\s*(?<structName>\w+)\s*{(?<props>[^}]*)}(\s*(?<aliasName1>\w+)?\s*,\s*(?<aliasName2>\*\w+)?\s*;\s*)?/gi;
console.log(exp);

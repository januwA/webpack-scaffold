import _ from "lodash";

import "~src/main.styl";
import Img from "~assets/image.jpg";
import jsonData from "~assets/data.json";

const img = document.querySelector<HTMLImageElement>("img#js-img");
img!.src = Img;

console.log(jsonData);
console.log(_.toUpper("ajanuw"));

console.log(await Promise.resolve("top await"));

let a;
a ??= "asd";
console.log(a);
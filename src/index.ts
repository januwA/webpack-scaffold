import _ from "lodash";

import "~src/main.styl";
import Img from "~assets/image.jpg";
import data from "~assets/data.json";

const img = document.querySelector("img");
img!.src = Img;
console.log(data);
console.log(_.toUpper("ajanuw"));

function each(arr?: []) {
  arr?.forEach(console.log);
}

each();

console.log( await Promise.resolve('top await') );
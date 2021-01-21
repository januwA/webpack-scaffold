import _ from "lodash";
import { Toast } from "bootstrap";

import "~src/main.styl";
import "./main.scss";
import Img from "~assets/image.jpg";
import jsonData from "~assets/data.json";

const img = document.querySelector<HTMLImageElement>("img#js-img");
img!.src = Img;

const e_toast = document.querySelector(".toast")!;
const b_toast = new Toast(e_toast);
img?.addEventListener("click", () => {
  if (e_toast.classList.contains("show")) {
    b_toast.hide();
  } else {
    b_toast.show();
  }
});

console.log(jsonData);
console.log(_.toUpper("ajanuw"));

console.log(await Promise.resolve("top await"));

let a;
a ??= "asd";
console.log(a);
import './main.css';
import Img from "./image.jpg";
import data from "./data.json";

document.body.insertAdjacentHTML('beforeend', `<h1>webpack-scaffold</h1>`)
document.body.insertAdjacentHTML('beforeend', `<img src=${Img} />`)
console.log(data);

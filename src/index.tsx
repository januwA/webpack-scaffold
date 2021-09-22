import React from "react";
import ReactDOM from "react-dom";

import { Routing, Routes } from "react-routerpp";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return <h2>hello</h2>;
};

const routes: Routes = [
  {
    exact: true,
    path: "",
    component: App,
  },
];

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routing routes={routes}></Routing>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom";
import { Typography } from "antd";
import { RxService } from "react-rxbuilder";

import "./index.sass";
import { Routing, Routes } from "react-routerpp";
import { AboutPage, Child } from "@pages/about";
import { HomePage } from "@pages/home";
import { TestPage } from "@pages/test";
import { BrowserRouter } from "react-router-dom";

const routes: Routes = [
  {
    exact: true,
    path: "",
    component: HomePage,
  },
  {
    path: "test",
    component: TestPage,
  },
  {
    path: "about",
    children: [
      {
        exact: true,
        path: "",
        component: AboutPage,
      },
      {
        path: ":name",
        component: Child,
      },
    ],
  },
];

ReactDOM.render(
  <React.StrictMode>
    <Typography>
      <BrowserRouter>
        <RxService>{() => <Routing routes={routes}></Routing>}</RxService>
      </BrowserRouter>
    </Typography>
  </React.StrictMode>,
  document.getElementById("root")
);

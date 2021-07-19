import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Typography } from "antd";

import "./index.sass";

import { AboutPage } from "@pages/about";
import { HomePage } from "@pages/home";
import { TestPage } from "@pages/test";

ReactDOM.render(
  <React.StrictMode>
    <Typography>
      <BrowserRouter>
        <Switch>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/test">
            <TestPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </BrowserRouter>
    </Typography>
  </React.StrictMode>,
  document.getElementById("root")
);

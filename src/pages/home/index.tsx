import React, { useEffect, useState } from "react";
import "./index.sass";
import { Header } from "./components/header";
import { Link } from "react-router-dom";

import { Button } from "antd";
import { useCount } from "@use/count.use";

export const HomePage = () => {
  const { count, inc } = useCount();

  return (
    <div className="app">
      <Header title="Webpack & React"></Header>
      <div className="count">
        <p>{count}</p>
        <Button type={`primary`} onClick={inc}>
          click me
        </Button>
        <br />
        <Link to="/about">Go To About Page</Link>
      </div>
    </div>
  );
};

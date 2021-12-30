import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import myimg from '@assets/i.jpg'

const App = () => {
  return <div>
    <h2>hello</h2>
    <img src="public/i.jpg" />
    <img src={myimg} />
  </div>
};


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

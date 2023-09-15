import React from "react";
import { createRoot } from 'react-dom/client';

import s from "./index.module.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import myimg from '@assets/i.jpg'


const App = () => {
  console.log(s);

  return <div>
    <h2 className={s.title}>hello</h2>
    <img src="public/i.jpg" />
    <img src={myimg} />
    <div className={s['px-to-viewport']}>
      <span className={s.title}>title</span>
    </div>
    <div className={s['un-px-to-viewport']}> </div>
    <div className={s.pxToViewport2}></div>
  </div>
};

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>
</React.StrictMode>);

import React from "react";
import { createRoot } from 'react-dom/client';

import { BrowserRouter, Route, Routes } from "react-router-dom";

import myimg from '@assets/i.jpg'

const App = () => {
  return <div>
    <h2>hello</h2>
    <img src="public/i.jpg" />
    <img src={myimg} />
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

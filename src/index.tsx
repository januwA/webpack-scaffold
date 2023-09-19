import React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useRoutes } from "react-router-dom";
import * as path from "path";

import NotFound from "./pages/_NotFound";
import App from "./pages/_App";


// 使用 require.context 来获取 pages 目录下的所有文件
const files = require.context('./pages', false, /\.[tj]sx$/);

// 一个函数，用于根据文件路径生成路由表
const createRoutes = () => {
  // 创建一个空数组，用于存放路由对象
  const routes: any[] = [];

  // 遍历文件上下文，根据文件名和路径动态导入组件，并创建路由对象
  for (const key of files.keys()) {
    // 获取文件名（去掉后缀）
    const routePath = path.basename(key.replace(/\.[jt]sx$/, ''));

    if (routePath[0] === '_') {
      continue;
    }

    const Comp = files(key).default;

    // 创建路由对象，包含path和element属性
    const route = {
      path: routePath,
      element: <Comp />,
    };

    // 将路由对象添加到路由数组中
    routes.push(route);
  }

  routes.push({
    path: '*',
    element: <NotFound />,
  });

  // 返回路由数组
  return routes;
};

const routes = createRoutes();

// 定义一个组件，用于渲染路由表
const RoutesComponent = () => {
  // 调用useRoutes钩子，传入路由数组，返回一个React元素
  const element = useRoutes(routes);

  // 返回渲染的元素
  return element;
};

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/*" element={<RoutesComponent />} />
    </Routes>
  </BrowserRouter>
</React.StrictMode>);

import { Header } from "./components/header";

import { Button } from "antd";
import { useService } from "react-rxbuilder";
import { CountService } from "@service/count.service";
import { Link2 } from "react-routerpp";
import "./index.sass";

export const HomePage = () => {
  const [s] = useService(CountService);

  return (
    <div className="app">
      <Header title="Webpack & React"></Header>
      <div className="count">
        <p>{s.count}</p>
        <Button type="primary" onClick={s.inc}>
          click me
        </Button>
        <br />
        <Link2 to="about">Go To About Page</Link2>
      </div>
    </div>
  );
};

import ijpg from "@assets/i.jpg";
import {
  Link,
  Switch,
  Route,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { message, Button, Space } from "antd";
import { api } from "@src/api";
import { useCount } from "@use/count.use";

const Child = () => {
  const params = useParams<{ name: string }>();
  return <> 子路由 {params.name}</>;
};

export const AboutPage = () => {
  let match = useRouteMatch();
  const {count, inc} = useCount();
  return (
    <Switch>
      <Route path={`${match.path}/:name`}>
        <Child></Child>
      </Route>
      <Route path={match.path}>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              message.info("This is a normal message");
            }}
          >
            About Page
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              const r = await api.get("/api/test");
              console.log(r);
            }}
          >
            http
          </Button>
          <Button type={`primary`} onClick={inc}>
            click me {count}
          </Button>
        </Space>
        <div>
          {/* 使用public下的静态资源 */}
          <Link to={`${match.path}/child-a`}>
            <img src="./public/i.jpg" alt="" />
          </Link>
          <br />

          {/* 使用 assets 下的静态资源 */}
          <Link to={`${match.path}/child-b`}>
            <img src={ijpg} alt="" />
          </Link>
        </div>
      </Route>
    </Switch>
  );
};

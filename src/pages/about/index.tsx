import ijpg from "@assets/i.jpg";
import { Link, useRouteMatch, useParams } from "react-router-dom";
import { message, Button, Space } from "antd";
import { api } from "@src/api";
import { useService } from "react-rxbuilder";
import { CountService } from "@service/count.service";
import { Link2 } from "react-routerpp";

export const Child = () => {
  const params = useParams<{ name: string }>();
  return <> 子路由 {params.name}</>;
};

export const AboutPage = () => {
  let match = useRouteMatch();
  const [service] = useService(CountService);
  console.log(match.path);

  return (
    <>
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
        <Button type={`primary`} onClick={service.inc}>
          click me {service.count}
        </Button>
      </Space>
      <div>
        {/* 使用public下的静态资源 */}
        <Link2 to="./child-a">
          <img src="./public/i.jpg" alt="" />
        </Link2>
        <br />

        {/* 使用 assets 下的静态资源 */}
        <Link2 to="./child-b">
          <img src={ijpg} alt="" />
        </Link2>
      </div>
    </>
  );
};

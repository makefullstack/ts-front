import { Menu } from "antd";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "..";
import { selectMenuAction, ISelectMenuState } from "../reducer/menu";
import { IInitialState } from "../reducer/request";
import { BarsOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
const { SubMenu } = Menu;

const Header: React.FC = () => {
  const { data } = useSelector<ReducerType, IInitialState>((state) => state.initialReducer);
  const { selectedKey } = useSelector<ReducerType, ISelectMenuState>((state) => state.menuReducer);

  const dispatch = useDispatch();
  const handleClick = React.useCallback(
    (e) => {
      dispatch(selectMenuAction(e.key));
    },
    [selectedKey],
  );

  return (
    <Menu onClick={handleClick} selectedKeys={[selectedKey]} mode="horizontal">
      {data[0].map((v) => (
        <SubMenu key={v.category} title={v.name} icon={<BarsOutlined />}>
          <Menu.Item key={v.category === "humor" ? "humortotal" : "hottotal"}>전체보기</Menu.Item>
          {data[1].map((d) => {
            if (d.category === v.category) {
              return <Menu.Item key={d.attrName}>{d.name}</Menu.Item>;
            }
          })}
        </SubMenu>
      ))}
    </Menu>
  );
};

export default Header;

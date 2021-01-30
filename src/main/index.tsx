import * as React from "react";
import { useSelector } from "react-redux";
import { ReducerType } from "..";
import { ISelectMenuState } from "../reducer/menu";
import MainList from "./MainList";

const Main: React.FC = () => {
  const { selectedKey } = useSelector<ReducerType, ISelectMenuState>((state) => state.menuReducer);

  return <MainList selectedKey={selectedKey} />;
};

export default Main;

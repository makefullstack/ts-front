import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialActions } from "./reducer/request";
import Header from "./header";
import Main from "./main";
import { ReducerType } from ".";
import { IReducerState } from "./reducer/util";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { done } = useSelector<ReducerType, IReducerState>((state) => state.initialReducer.state);
  React.useEffect(() => {
    dispatch(initialActions.request());
  }, []);
  return (
    <>
      {done && (
        <>
          <Header />
          <Main />
        </>
      )}
    </>
  );
};

export default App;

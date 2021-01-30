import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import axios from "axios";
import rootReducer from "./reducer/rootReducer";
import rootSaga from "./saga/rootSaga";

axios.defaults.baseURL = "http://localhost:3000";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({ reducer: rootReducer, middleware: [sagaMiddleware, logger] as const });

export type ReducerType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
sagaMiddleware.run(rootSaga); //store 생성후 사가 실행

const Root: React.FC = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

ReactDOM.render(<Root />, document.querySelector("#root"));

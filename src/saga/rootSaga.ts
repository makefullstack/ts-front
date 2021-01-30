import { all, fork } from "redux-saga/effects";
import sagaRequest from "./request";

export default function* () {
  yield all([fork(sagaRequest)]);
}

import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosPromise, AxiosResponse } from "axios";
import { all, call, fork, put, take, takeEvery, takeLatest } from "redux-saga/effects";
import {
  humorRequestActions,
  initialActions,
  ISitePollingRequestPayload,
  ISiteRequestPayload,
} from "../reducer/request";

// export interface ISiteInitMeta {
//   name: string;
//   attrName: string;
//   iconUrl: string;
//   category: string;
// }
// export interface ISiteInitCategoryMeta {
//   category: string;
//   name: string;
// }
// export interface ISiteInitReturn {
//   categoryMeta: ISiteInitCategoryMeta[];
//   siteMeta: ISiteInitMeta[];
// }

export interface ISiteInitMetaDataRaw {
  attrName: string;
  name: string;
  iconUrl: string;
  category: string;
}

export type ISiteCategoryName = {
  category: string;
  name: string;
};

export type SiteInitReturnType = [ISiteCategoryName[], ISiteInitMetaDataRaw[]];

function loadInitAPI(): AxiosPromise<SiteInitReturnType> {
  return axios.get("/api/init");
}
function* getInitRequest() {
  try {
    const response: AxiosResponse<SiteInitReturnType> = yield call(loadInitAPI);
    const result = response.data;
    yield all([put(initialActions.success(result)), put(humorRequestActions.initializeData(result[1]))]);
  } catch (e) {
    yield put(initialActions.error(e.response.data));
  }
}
export interface ISiteFailurePayload {
  selectedKey: string;
  error: string;
}
export interface ISiteSuccessPayload {
  selectedKey: string;
  data: ISiteRequestData[];
}
export interface ISiteRequestData {
  site?: string;
  id: number;
  title: string;
  url: string;
}
function loadHumorAPI(payload: ISiteRequestPayload): AxiosPromise<ISiteRequestData[]> {
  return axios.get("/api/info", { params: { site: payload.selectedKey, lastId: payload.lastId, limit: 10 } });
}
function* getHumorRequest(action: PayloadAction<ISiteRequestPayload>) {
  try {
    const request: AxiosResponse<ISiteRequestData[]> = yield call(loadHumorAPI, action.payload);
    const result: ISiteSuccessPayload = {
      selectedKey: action.payload.selectedKey,
      data: request.data,
    };
    yield put(humorRequestActions.success(result));
  } catch (e) {
    const result: ISiteFailurePayload = {
      selectedKey: action.payload.selectedKey,
      error: e.response.data,
    };
    yield put(humorRequestActions.error(result));
  }
}

function loadHumorPollingAPI(payload: ISitePollingRequestPayload): AxiosPromise<ISiteRequestData[]> {
  return axios.get("/api/polling", {
    timeout: 80000,
    params: { site: payload.selectedKey, recentId: payload.recentId },
  });
}
function* getHumorPolling(action: PayloadAction<ISitePollingRequestPayload>) {
  try {
    const request: AxiosResponse<ISiteRequestData[]> = yield call(loadHumorPollingAPI, action.payload);
    const result: ISiteSuccessPayload = {
      selectedKey: action.payload.selectedKey,
      data: request.data,
    };
    yield put(humorRequestActions.pollingSuccess(result));
  } catch (e) {
    const result: ISiteFailurePayload = {
      selectedKey: action.payload.selectedKey,
      error: e.response.data,
    };
    yield put(humorRequestActions.error(result));
  }
}
function* watchSiteLoad() {
  yield takeLatest(humorRequestActions.request, getHumorRequest);
}
function* watchInitialLoad() {
  yield take(initialActions.request);
  yield call(getInitRequest);
}
function* watchPollingLoad() {
  yield takeEvery(humorRequestActions.pollingRequest, getHumorPolling);
}
export default function* () {
  yield all([fork(watchInitialLoad), fork(watchSiteLoad), fork(watchPollingLoad)]);
}

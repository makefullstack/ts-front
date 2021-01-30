import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ISiteSuccessPayload,
  ISiteFailurePayload,
  ISiteRequestData,
  SiteInitReturnType,
  ISiteInitMetaDataRaw,
} from "../saga/request";
import { IReducerState, reducerState } from "./util";

export interface IInitialState {
  state: IReducerState;
  data: SiteInitReturnType;
}

// export interface ISiteInitData {
//   category: string;
//   categoryName: string;
//   data: ISiteInitMetaData[];
// }
// export interface ISiteInitMetaData {
//   attrName: string;
//   name: string;
//   iconUrl: string;
// }
const initialState: IInitialState = { state: reducerState.initial(), data: [[], []] };
const initialStateSlice = createSlice({
  name: "INITIAL_STATE",
  initialState,
  reducers: {
    request: (state) => {
      state.state = reducerState.loading();
    },
    success: (state, action: PayloadAction<SiteInitReturnType>) => {
      state.state = reducerState.done();
      state.data = action.payload;
    },
    error: (state, action) => {
      state.state = reducerState.error(action.payload);
    },
  },
});

export interface ISiteData {
  polling: IReducerState;
  state: IReducerState;
  isMoreLoad: boolean;
  lists: ISiteRequestData[];
}
export interface ISiteDataGroup {
  [index: string]: ISiteData;
}

export interface ISiteRequestPayload {
  selectedKey: string;
  lastId?: number;
}

export interface ISitePollingRequestPayload {
  recentId: number;
  selectedKey: string;
}

const humorRequestInitialState: ISiteDataGroup = {
  humortotal: {
    polling: reducerState.initial(),
    state: reducerState.initial(),
    isMoreLoad: true,
    lists: [],
  },
  hottotal: {
    polling: reducerState.initial(),
    state: reducerState.initial(),
    isMoreLoad: true,
    lists: [],
  },
};

const humorRequestStateSlice = createSlice({
  name: "HUMOR_STATE",
  initialState: humorRequestInitialState,
  reducers: {
    initializeData: (state, action: PayloadAction<ISiteInitMetaDataRaw[]>) => {
      const result = action.payload.reduce((prev, cur): ISiteDataGroup => {
        const makeData: ISiteDataGroup = {
          [cur.attrName]: {
            state: reducerState.initial(),
            polling: reducerState.initial(),
            isMoreLoad: true,
            lists: [],
          },
        };
        return {
          ...prev,
          ...makeData,
        };
      }, {});
      return { ...state, ...result };
    },
    request: (state, action: PayloadAction<ISiteRequestPayload>) => {
      state[action.payload.selectedKey].state = reducerState.loading();
    },
    success: (state, action: PayloadAction<ISiteSuccessPayload>) => {
      state[action.payload.selectedKey].lists.push(...action.payload.data);
      state[action.payload.selectedKey].state = reducerState.done();
      state[action.payload.selectedKey].isMoreLoad = action.payload.data.length === 10; //10은 limit 수
    },
    error: (state, action: PayloadAction<ISiteFailurePayload>) => {
      state[action.payload.selectedKey].state = reducerState.error(action.payload.error);
    },

    pollingRequest: (state, action: PayloadAction<ISitePollingRequestPayload>) => {
      state[action.payload.selectedKey].polling = reducerState.loading();
    },
    pollingSuccess: (state, action: PayloadAction<ISiteSuccessPayload>) => {
      state[action.payload.selectedKey].lists.unshift(...action.payload.data);
      state[action.payload.selectedKey].polling = reducerState.done();
    },
    pollingError: (state, action: PayloadAction<ISiteFailurePayload>) => {
      state[action.payload.selectedKey].polling = reducerState.error(action.payload.error);
    },
  },
});

export const { actions: initialActions, reducer: initialReducer } = initialStateSlice;
export const { actions: humorRequestActions, reducer: humorRequestReducer } = humorRequestStateSlice;

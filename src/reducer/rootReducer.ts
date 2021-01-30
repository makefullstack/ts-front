import { combineReducers } from "redux";
import menuReducer from "./menu";
import { initialReducer, humorRequestReducer } from "./request";

const rootReducer = combineReducers({ menuReducer, initialReducer, humorRequestReducer });

export default rootReducer;

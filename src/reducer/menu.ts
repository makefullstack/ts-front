import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";

const SELECT_MENU = "SELECT_MENU";

export const selectMenuAction = createAction<string>(SELECT_MENU);

export interface ISelectMenuState {
  selectedKey: string;
}
const INITIAL_STATE: ISelectMenuState = {
  selectedKey: "humortotal",
};

const selectMenuReducer = createReducer(INITIAL_STATE, (builder) => {
  builder.addCase(selectMenuAction, (state, action: PayloadAction<string>) => {
    state.selectedKey = action.payload;
  });
});

export default selectMenuReducer;

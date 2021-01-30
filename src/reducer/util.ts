export const reducerState = {
  initial(): IReducerState {
    return {
      load: false,
      done: false,
      error: null,
    };
  },
  loading(): IReducerState {
    return {
      load: true,
      done: false,
      error: null,
    };
  },
  done(): IReducerState {
    return {
      load: false,
      done: true,
      error: null,
    };
  },
  error(error: string | null): IReducerState {
    return {
      load: false,
      done: false,
      error,
    };
  },
};

export interface IReducerState {
  load: boolean;
  done: boolean;
  error: string | null;
}

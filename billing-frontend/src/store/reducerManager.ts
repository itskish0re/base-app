import { combineReducers, type Action, type Reducer } from '@reduxjs/toolkit';

type ReducerMap = Record<string, Reducer>;

/**
 * Supports adding/removing reducers at runtime (e.g. per-screen slices).
 * Removed slice state is dropped from the next state object after unmount.
 */
export function createReducerManager(initialReducers: ReducerMap) {
  let reducers = { ...initialReducers };
  let combinedReducer = combineReducers(reducers);
  const keysToRemove: string[] = [];

  return {
    getReducerMap: () => reducers,

    reduce: (state: Record<string, unknown> | undefined, action: Action) => {
      let nextState = state;

      if (keysToRemove.length > 0 && nextState) {
        nextState = { ...nextState };
        for (const key of keysToRemove) {
          delete nextState[key];
        }
        keysToRemove.length = 0;
      }

      return combinedReducer(nextState, action);
    },

    add: (key: string, reducer: Reducer) => {
      if (!key || reducers[key]) {
        return;
      }

      reducers = { ...reducers, [key]: reducer };
      combinedReducer = combineReducers(reducers);
    },

    remove: (key: string) => {
      if (!key || !reducers[key]) {
        return;
      }

      reducers = { ...reducers };
      delete reducers[key];
      keysToRemove.push(key);
      combinedReducer = combineReducers(reducers);
    },
  };
}

export type ReducerManager = ReturnType<typeof createReducerManager>;

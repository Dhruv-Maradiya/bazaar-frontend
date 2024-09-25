// ** Toolkit imports
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// ** Reducers
import settings, { resetStore, initialState } from "@/store/settings/user";

const reducers = {
  settings: settings,
};

const combinedReducer = combineReducers({
  ...reducers,
});

const rootReducer = (state, action) => {
  if (action.type === resetStore.type) {
    state = {
      ...reducers,
      settings: initialState(),
    };
  }

  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// ** Toolkit imports
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// ** Firebase imports
import { app as firebaseApp } from "@/lib/firebase/init";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";

// ** Reducers
import settings from "@/store/settings/user";
import { firebaseReducer } from "react-redux-firebase";

const rrfConfig = {
  useFirestoreForProfile: true,
};

const combinedReducer = combineReducers({
  settings: settings,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

const rootReducer = (state, action) => {
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const rrfProps = {
  firebase: firebaseApp,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance: createFirestoreInstance,
};

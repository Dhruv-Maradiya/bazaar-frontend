// ** Redux
import { createAction, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export const resetStore = createAction("RESET_STORE");

export const initialState = () => {
  return {
    user: null,
    loading: true,
    sessionId: uuidv4(),
  };
};

// ** Slice
export const appSettingSlice = createSlice({
  name: "settings",
  initialState: initialState(),
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// ** Actions
export const { setUser, setLoading } = appSettingSlice.actions;

// ** Reducer
export default appSettingSlice.reducer;

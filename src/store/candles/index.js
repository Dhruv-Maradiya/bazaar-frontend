// ** Redux
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// ** Add Candle Documents
export const addCandles = createAsyncThunk(
  "candles/addCandles",
  async ({ stockId, candles }) => {
    return { stockId, candles };
  },
);

// ** Update Candle Documents
export const updateCandles = createAsyncThunk(
  "candles/updateCandles",
  async ({ stockId, candles }) => {
    return { stockId, candles };
  },
);

// ** Remove Candle Document
export const removeCandles = createAsyncThunk(
  "candles/removeCandles",
  async ({ stockId, candleIds }) => {
    return { stockId, candleIds };
  },
);

// ** Slice
export const candlesSlice = createSlice({
  name: "candles",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addCandles.fulfilled, (state, action) => {
      const { stockId, candles } = action.payload;

      const key = stockId;

      if (!state[key]) {
        state[key] = {};
      }

      candles.forEach((candle) => {
        state[key][candle.id] = candle;
      });
    });

    builder.addCase(updateCandles.fulfilled, (state, action) => {
      const { stockId, candles } = action.payload;

      const key = stockId;

      if (!state[key]) {
        state[key] = {};
      }

      candles.forEach((candle) => {
        state[key][candle.id] = candle;
      });
    });

    builder.addCase(removeCandles.fulfilled, (state, action) => {
      const { stockId, candleIds } = action.payload;

      const key = stockId;

      if (!state[key]) {
        state[key] = {};
      }

      candleIds.forEach((candleId) => {
        delete state[key][candleId];
      });
    });
  },
});

// ** Reducer
export default candlesSlice.reducer;

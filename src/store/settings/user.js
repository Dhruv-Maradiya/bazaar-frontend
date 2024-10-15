// ** Redux
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "@/lib/firebase/init";
import toast from "react-hot-toast";
import firebase from "firebase/compat/app";
import {
  TransactionTypeMap,
  TransactionTypeMapSellMap,
} from "@/utils/timestamp";

// ** Buy Stock
export const buyStock = createAsyncThunk(
  "stocks/buyStock",
  async (
    { stockId, shares, userId, type, price, brokerage },
    { rejectWithValue, getState }
  ) => {
    try {
      const currentPortfolio = getState().firestore.data.firestoreUser;

      const alreadyInvested = currentPortfolio.data?.find(
        (stock) => stock.stock.id === stockId && stock.type === type
      );

      let newData;

      if (alreadyInvested) {
        const totalShares = alreadyInvested.shares + shares;
        const totalMoney =
          alreadyInvested.price * alreadyInvested.shares + price * shares;

        const newPrice = totalMoney / totalShares;

        newData = currentPortfolio.data.map((stock) => {
          if (stock.stock.id === stockId && stock.type === type) {
            return {
              stock: db.collection("stocks").doc(stockId),
              shares: totalShares,
              price: newPrice,
              type,
            };
          }
          return stock;
        });
      } else {
        newData = firebase.firestore.FieldValue.arrayUnion({
          stock: db.collection("stocks").doc(stockId),
          shares: parseInt(shares),
          price,
          type,
        });
      }

      await db.runTransaction(async (transaction) => {
        transaction.update(db.collection("users").doc(userId), {
          available: firebase.firestore.FieldValue.increment(
            -(price * shares + brokerage)
          ),
          invested: firebase.firestore.FieldValue.increment(price * shares),
          data: newData,
        });

        // Add new transaction to subcollection transaction of users
        transaction.set(
          db.collection("users").doc(userId).collection("transactions").doc(),
          {
            createdAt: new Date(),
            price,
            profitLoss: null,
            quantity: shares,
            type: type, // BUY or SHORT SELL
            // Reference to stock document
            stock: db.collection("stocks").doc(stockId),
          }
        );
      });

      toast.success(`${TransactionTypeMap[type]} order placed successfully`);
    } catch (error) {
      toast.error("Error buying stock please try again");

      return rejectWithValue(error);
    }
  }
);

// ** Sell Stock
export const sellStock = createAsyncThunk(
  "stocks/sellStock",
  async (
    { stockId, shares, userId, type, price, profitOrLoss, brokerage },
    { rejectWithValue, getState }
  ) => {
    try {
      const currentPortfolio = getState().firestore.data.firestoreUser;

      const currentHoldings = currentPortfolio?.data?.find(
        (item) =>
          item.stock.id === stockId &&
          item.type === TransactionTypeMapSellMap[type]
      );

      if (!currentHoldings) {
        toast.error("Something went wrong!");
        return;
      }

      let newData = {};

      if (currentHoldings.shares - shares === 0) {
        newData = firebase.firestore.FieldValue.arrayRemove(currentHoldings);
      } else {
        newData = currentPortfolio.data.map((stock) => {
          if (
            stock.stock.id === stockId &&
            stock.type === TransactionTypeMapSellMap[type]
          ) {
            return {
              ...stock,
              shares: stock.shares - shares,
            };
          }
          return stock;
        });
      }

      await db.runTransaction(async (transaction) => {
        // Update portfolio
        transaction.update(db.collection("users").doc(userId), {
          data: newData,
          available: firebase.firestore.FieldValue.increment(
            price * shares - brokerage
          ),
          invested: firebase.firestore.FieldValue.increment(
            currentHoldings.price * shares * -1
          ),
          realized: firebase.firestore.FieldValue.increment(profitOrLoss),
          unrealized: firebase.firestore.FieldValue.increment(-profitOrLoss),
          total: firebase.firestore.FieldValue.increment(profitOrLoss),
        });

        // Add new transaction to subcollection transaction of users
        transaction.set(
          db.collection("users").doc(userId).collection("transactions").doc(),
          {
            createdAt: new Date(),
            price,
            profitLoss: profitOrLoss,
            quantity: shares,
            type: type, // BUY or SHORT SELL
            // Reference to stock document
            stock: db.collection("stocks").doc(stockId),
          }
        );
      });

      toast.success(
        `Stock ${type === "SELL" ? "sold" : "squared off"} successfully`
      );
    } catch (error) {
      console.log(error);
      toast.error("Error selling stock please try again");

      return rejectWithValue(error);
    }
  }
);

// ** Fetch All Stocks
export const fetchAllStocks = createAsyncThunk(
  "stocks/fetchAllStocks",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { stocks: storedStocks } = getState().settings;

      if (storedStocks.length) {
        return storedStocks;
      }

      const stocks = await db.collection("stocks").get();

      const data = stocks.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ** Slice
export const appSettingSlice = createSlice({
  name: "settings",
  initialState: {
    stocks: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllStocks.fulfilled, (state, action) => {
      state.stocks = action.payload;
    });
  },
});

// ** Reducer
export default appSettingSlice.reducer;

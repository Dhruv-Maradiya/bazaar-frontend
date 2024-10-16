import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const Timestamp = firebase.firestore.Timestamp;

const convertFirebaseTimestampToDate = (timestamp) => {
  if (timestamp instanceof Timestamp) {
    return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
  }

  return timestamp;
};

const TransactionTypeMap = {
  BUY: "Buy",
  SELL: "Sell",
  "SHORT SELL": "Short Sell",
  "SQUARE OFF": "Square off",
};

const TransactionTypeMapSellMap = {
  SELL: "BUY",
  "SQUARE OFF": "SHORT SELL",
};

const TransactionTypeMapBuyMap = {
  BUY: ["BUY", "SELL"],
  "SHORT SELL": ["SHORT SELL", "SQUARE OFF"],
};

export {
  convertFirebaseTimestampToDate,
  TransactionTypeMap,
  TransactionTypeMapSellMap,
  TransactionTypeMapBuyMap,
};

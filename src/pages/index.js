import { compose } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Dashboard from "@/pages/dashboard"

const stocks = [
  { name: "Apple", symbol: "AAPL", price: 150 },
  { name: "Google", symbol: "GOOGL", price: 2800 },
  { name: "Amazon", symbol: "AMZN", price: 3400 },
];

const StockList = ({ stocks: _stocks }) => {
  console.log(_stocks);

  return (
    <>
      <Dashboard />
    </>
  );
};

export default compose(
  firestoreConnect([{ collection: "stocks" }]),
  connect((state, props) => ({
    stocks: state.firestore.ordered.stocks,
  }))
)(StockList);

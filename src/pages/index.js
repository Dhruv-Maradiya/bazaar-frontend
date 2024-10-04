import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { compose } from "@reduxjs/toolkit";
import { PageContainer } from "@toolpad/core";
import { firestoreConnect } from "react-redux-firebase";

const stocks = [
  { name: "Apple", symbol: "AAPL", price: 150 },
  { name: "Google", symbol: "GOOGL", price: 2800 },
  { name: "Amazon", symbol: "AMZN", price: 3400 },
];

const StockList = () => {
  return (
    <PageContainer breadCrumbs={[]}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell>{stock.name}</TableCell>
                <TableCell>{stock.symbol}</TableCell>
                <TableCell>{stock.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default compose(firestoreConnect([{ collection: "stocks" }]))(StockList);

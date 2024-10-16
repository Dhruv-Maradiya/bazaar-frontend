import { formatCurr } from "@/utils/format-number";
import {
  convertFirebaseTimestampToDate,
  TransactionTypeMap,
} from "@/utils/timestamp";
import TrendingDown from "@mui/icons-material/TrendingDown";
import TrendingUp from "@mui/icons-material/TrendingUp";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { compose } from "@reduxjs/toolkit";
import { PageContainer } from "@toolpad/core";
import * as moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.white,
}));

const TransactionsView = () => {
  const transactionsMap = useSelector(
    (state) => state.firestore.data.transactions,
  );
  const allStocks = useSelector((state) => state.settings.stocks);

  const router = useRouter();

  const transactions = Object.values(transactionsMap || {});

  return (
    <PageContainer title="">
      <Box sx={{ margin: "auto" }}>
        <TableContainer component={Paper} elevation={3}>
          {transactions && transactions.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ p: 3 }}>
              No transactions found
            </Typography>
          ) : (
            <Table aria-label="purchase history">
              <TableHead
                sx={{
                  backgroundColor: "primary.dark",
                }}
              >
                <TableRow>
                  <StyledTableCell component={Typography}>
                    Stock
                  </StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Price</StyledTableCell>
                  <StyledTableCell>Quantity</StyledTableCell>
                  <StyledTableCell>Total</StyledTableCell>
                  <StyledTableCell>Type</StyledTableCell>
                  <StyledTableCell>Gain/Loss</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions
                  .filter((transaction) => transaction && transaction.stock)
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((transaction) => {
                    const stock = allStocks.find(
                      (stock) => stock.id === transaction.stock.id,
                    );

                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Box
                            display="flex"
                            alignItems="center"
                            sx={{
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              router.push(`/stocks/${stock.id}`);
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                backgroundColor: "#76b82a",
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                marginRight: "8px",
                              }}
                            >
                              {stock.symbol}
                            </Box>
                            {stock.name}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {moment(
                            convertFirebaseTimestampToDate(
                              transaction.createdAt,
                            ),
                          ).format("DD MMM YYYY, hh:mm")}
                        </TableCell>
                        <TableCell>{formatCurr(transaction.price)}</TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {formatCurr(transaction.quantity * transaction.price)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={TransactionTypeMap[transaction.type]}
                            color="warning"
                            size="small"
                            sx={{
                              borderRadius: 1,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {transaction.profitLoss ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {transaction.profitLoss >= 0 ? (
                                <TrendingUp
                                  color="success"
                                  fontSize="small"
                                  sx={{ mr: 0.5 }}
                                />
                              ) : (
                                <TrendingDown
                                  color="error"
                                  fontSize="small"
                                  sx={{ mr: 0.5 }}
                                />
                              )}
                              <Typography
                                component="span"
                                sx={{
                                  color:
                                    transaction.profitLoss >= 0
                                      ? "success.main"
                                      : "error.main",
                                }}
                              >
                                {formatCurr(transaction.profitLoss)}
                              </Typography>
                            </Box>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Box>
    </PageContainer>
  );
};

export default compose(
  firestoreConnect((props) => [
    {
      collection: "users",
      doc: props.userId,
      subcollections: [{ collection: "transactions" }],
      storeAs: "transactions",
    },
  ]),
)(TransactionsView);

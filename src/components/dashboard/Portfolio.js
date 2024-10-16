import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import moment from "moment";
import firebase from "firebase/compat/app";
import { db as firestore } from "@/lib/firebase/init";
import { formatCurr, formatPercent } from "@/utils/format-number";
import {
  convertFirebaseTimestampToDate,
  TransactionTypeMap,
  TransactionTypeMapBuyMap,
} from "@/utils/timestamp";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

// Styles
const styles = {
  symbolBadge: {
    backgroundColor: "#76b82a",
    color: "white",
    padding: "2px 8px",
    borderRadius: "4px",
    marginRight: "8px",
  },
  gainText: (gain) => ({
    color: gain >= 0 ? "success.main" : "error.main",
  }),
  portfolioIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#e8f0fe",
    borderRadius: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
};

// Helper Components
const SymbolBadge = ({ symbol }) => (
  <Box component="span" sx={styles.symbolBadge}>
    {symbol}
  </Box>
);

const GainText = ({ gain, children }) => (
  <Typography component="span" sx={styles.gainText(gain)}>
    {children}
  </Typography>
);

// Main Components
const StockRow = ({
  portfolioStock,
  expanded,
  onToggle,
  stockData,
  transactions,
}) => {
  const router = useRouter();
  const gain = calculateGain(portfolioStock, stockData);
  const gainInPercent = calculateGainPercent(portfolioStock, stockData);

  return (
    <>
      <TableRow>
        <TableCell>
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={() => router.push(`/stocks/${portfolioStock.stock.id}`)}
          >
            <SymbolBadge symbol={stockData?.symbol} />
            {stockData?.name}
          </Box>
        </TableCell>
        <TableCell align="right">{formatCurr(portfolioStock?.price)}</TableCell>
        <TableCell align="right">{formatCurr(stockData?.price)}</TableCell>
        <TableCell align="right">{portfolioStock.shares}</TableCell>
        <TableCell align="right">
          <GainText gain={gain}>
            <Typography component="span" mr={1}>
              {formatCurr(gain)}
            </Typography>
            <Typography component="span">
              {gainInPercent >= 0 ? "▲" : "▼"} {formatPercent(gainInPercent)}
            </Typography>
          </GainText>
        </TableCell>
        <TableCell align="right">
          {formatCurr(portfolioStock.shares * (stockData?.price || 0))}
        </TableCell>
        <TableCell padding="none">
          <IconButton onClick={onToggle} size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
        <TableCell padding="none">
          {TransactionTypeMap[portfolioStock.type]}
        </TableCell>
      </TableRow>
      {expanded && <TransactionDetails transactions={transactions} />}
    </>
  );
};

const TransactionDetails = ({ transactions }) => (
  <TableRow>
    <TableCell colSpan={6} sx={{ paddingBottom: 0, paddingTop: 0 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>PURCHASE DATE</TableCell>
            <TableCell align="right">PURCHASE PRICE</TableCell>
            <TableCell align="right">QUANTITY</TableCell>
            <TableCell align="right">P/L</TableCell>
            <TableCell align="right">VALUE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((purchase, index) => (
            <TransactionRow key={index} purchase={purchase} />
          ))}
        </TableBody>
      </Table>
    </TableCell>
  </TableRow>
);

const TransactionRow = ({ purchase }) => (
  <TableRow>
    <TableCell>
      {moment(convertFirebaseTimestampToDate(purchase.createdAt)).format(
        "DD MMM YYYY, hh:mm A"
      )}
    </TableCell>
    <TableCell align="right">{formatCurr(purchase.price)}</TableCell>
    <TableCell align="right">{purchase.quantity}</TableCell>
    <TableCell align="right" sx={styles.gainText(purchase.profitLoss)}>
      {purchase.profitLoss !== null ? formatCurr(purchase.profitLoss) : "-"}
    </TableCell>
    <TableCell align="right">
      {formatCurr(purchase.quantity * purchase.price)}
    </TableCell>
  </TableRow>
);

const PortfolioDetails = ({ portfolio, open, onClose }) => {
  const [expandedStock, setExpandedStock] = useState([]);
  const [portfolioStocks, setPortfolioStocks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!portfolio || !open) return;
    fetchPortfolioData(portfolio, setPortfolioStocks, setTransactions);
  }, [portfolio, open]);

  if (!portfolio || !portfolio.data || portfolio.data.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Portfolio Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1">No stocks in your portfolio</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Portfolio Details</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SYMBOL NAME</TableCell>
              <TableCell align="right">PURCHASE PRICE</TableCell>
              <TableCell align="right">PRICE</TableCell>
              <TableCell align="right">QUANTITY</TableCell>
              <TableCell align="right">GAIN</TableCell>
              <TableCell align="right">VALUE</TableCell>
              <TableCell align="right">TYPE</TableCell>
              <TableCell padding="none" />
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolio.data.map((portfolioStock) => (
              <StockRow
                key={`${portfolioStock.stock.id}-${portfolioStock.type}`}
                portfolioStock={portfolioStock}
                expanded={expandedStock.includes(
                  `${portfolioStock.stock.id}-${portfolioStock.type}`
                )}
                onToggle={() =>
                  toggleStockExpansion(
                    portfolioStock,
                    expandedStock,
                    setExpandedStock
                  )
                }
                stockData={portfolioStocks.find(
                  (s) => s.id === portfolioStock.stock.id
                )}
                transactions={filterTransactions(transactions, portfolioStock)}
              />
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

const PortfolioSummary = ({ portfolio }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
      flexDirection: "column",
    }}
  >
    {["Invested", "Available", "Realized P/L", "Unrealized P/L"].map(
      (label) => (
        <SummaryRow
          key={label}
          label={label}
          value={portfolio?.[label.toLowerCase().replace(" p/l", "")]}
        />
      )
    )}
  </Box>
);

const SummaryRow = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      fontSize: {
        xs: "14px", // Extra-small devices (phones)
        sm: "16px", // Small devices (tablets)
        md: "18px", // Medium devices (desktops)
        lg: "20px", // Large devices (large desktops)
        xl: "24px", // Extra-large devices (larger screens)
      },
      padding: {
        xs: "8px", // Responsive padding for small screens
        sm: "10px",
        md: "12px",
        lg: "14px",
        xl: "16px",
      },
    }}
  >
    <Typography variant="body1" sx={{ fontSize: "inherit" }}>
      {label}:
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: "inherit" }}>
      {formatCurr(value)}
    </Typography>
  </Box>
);

const Portfolio = () => {
  const [openPortfolioDetails, setOpenPortfolioDetails] = useState(false);
  const portfolio = useSelector((state) => state.firestore.data.firestoreUser);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={styles.portfolioIcon}>
          <Typography variant="h6" sx={{ color: "#4285f4" }}>
            ₹
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
                lg: "20px",
                xl: "24px",
              },
            }}
            variant="subtitle2"
          >
            Your portfolio
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Only you can see this
          </Typography>
        </Box>
      </Box>
      <Typography
        sx={{ fontWeight: "bold", fontWeight: 500 }}
        variant="h4"
        gutterBottom
      >
        {formatCurr(portfolio?.total)}
      </Typography>
      <PortfolioSummary portfolio={portfolio} />
      <Button
        sx={{ borderRadius: "11px" }}
        fullWidth
        variant="outlined"
        onClick={() => setOpenPortfolioDetails(true)}
      >
        Show Details
      </Button>
      <PortfolioDetails
        open={openPortfolioDetails}
        onClose={() => setOpenPortfolioDetails(false)}
        portfolio={portfolio}
      />
    </>
  );
};

// Helper functions
const calculateGain = (portfolioStock, stockData) => {
  let gain =
    (stockData?.price - portfolioStock?.price || 0) *
    (portfolioStock?.shares || 0);
  return portfolioStock.type === "SHORT SELL" ? -gain : gain;
};

const calculateGainPercent = (portfolioStock, stockData) => {
  let gainInPercent = (stockData?.price * 100) / portfolioStock?.price - 100;
  return portfolioStock.type === "SHORT SELL" ? -gainInPercent : gainInPercent;
};

const fetchPortfolioData = async (
  portfolio,
  setPortfolioStocks,
  setTransactions
) => {
  if (!portfolio.data || portfolio.data.length === 0) {
    setPortfolioStocks([]);
    setTransactions([]);
    return;
  }

  const [stocks, transactions] = await Promise.all([
    firestore
      .collection("stocks")
      .where(
        firebase.firestore.FieldPath.documentId(),
        "in",
        portfolio.data.map((stock) => stock.stock.id)
      )
      .get(),
    firestore
      .collection("users")
      .doc(portfolio.id)
      .collection("transactions")
      .get(),
  ]);

  setPortfolioStocks(stocks.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  setTransactions(transactions.docs.map((doc) => doc.data()));
};

const toggleStockExpansion = (
  portfolioStock,
  expandedStock,
  setExpandedStock
) => {
  const rowId = `${portfolioStock.stock.id}-${portfolioStock.type}`;
  setExpandedStock((prev) =>
    prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
  );
};

const filterTransactions = (transactions, portfolioStock) =>
  transactions.filter(
    (t) =>
      t.stock.id === portfolioStock.stock.id &&
      TransactionTypeMapBuyMap[portfolioStock.type].includes(t.type)
  );

export default Portfolio;

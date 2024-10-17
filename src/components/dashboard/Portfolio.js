import ApexCharts from "@/@core/components/react-apexcharts";
import { db as firestore } from "@/lib/firebase/init";
import { formatCurr, formatPercent } from "@/utils/format-number";
import {
  convertFirebaseTimestampToDate,
  TransactionTypeMap,
  TransactionTypeMapBuyMap,
} from "@/utils/timestamp";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
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
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import firebase from "firebase/compat/app";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

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
    color: gain > 0 ? "success.main" : gain < 0 ? "error.main" : "text.primary",
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
        <TableCell>{formatCurr(portfolioStock?.price)}</TableCell>
        <TableCell>{formatCurr(stockData?.price)}</TableCell>
        <TableCell>{portfolioStock.shares}</TableCell>
        <TableCell>
          <GainText gain={gain}>
            <Typography component="span" mr={1}>
              {formatCurr(gain)}
            </Typography>
            <Typography component="span">
              {gainInPercent >= 0 ? "▲" : "▼"} {formatPercent(gainInPercent)}
            </Typography>
          </GainText>
        </TableCell>
        <TableCell>
          {formatCurr(portfolioStock.shares * (stockData?.price || 0))}
        </TableCell>

        <TableCell>{TransactionTypeMap[portfolioStock.type]}</TableCell>
        <TableCell>
          <IconButton onClick={onToggle} size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
      </TableRow>
      {expanded && <TransactionDetails transactions={transactions} />}
    </>
  );
};

const TransactionDetails = ({ transactions }) => (
  <TableRow
    sx={{
      borderBottom: "none",
    }}
  >
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

const PortfolioChart = ({ history }) => {
  const theme = useTheme();

  const series = useMemo(() => {
    return history.map((h) => [h.date.toDate().getTime(), h.value]);
  }, [history]);

  const options = useMemo(() => {
    return {
      chart: {
        toolbar: {
          show: false,
        },
        background: "transparent",
      },
      theme: {
        mode: theme.palette.mode,
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => formatCurr(value),
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      colors: [theme.palette.primary.main],
      tooltip: {
        x: {
          format: "HH:mm:ss",
        },
      },
    };
  }, [theme.palette.mode, theme.palette.primary.main]);

  return (
    <Box
      sx={{
        maxHeight: 300,
      }}
    >
      <ApexCharts
        type="area"
        series={[
          {
            data: series,
            name: "Portfolio Value",
          },
        ]}
        options={options}
        height={300}
      />
    </Box>
  );
};

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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Portfolio Details</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <PortfolioChart history={portfolio?.history || []} />
        <TableContainer
          sx={{
            overflowX: "auto",
            // Hide scrollbar
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            p: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SYMBOL NAME</TableCell>
                <TableCell>PURCHASE PRICE</TableCell>
                <TableCell>PRICE</TableCell>
                <TableCell>QUANTITY</TableCell>
                <TableCell>GAIN</TableCell>
                <TableCell>VALUE</TableCell>
                <TableCell>TYPE</TableCell>
                <TableCell padding="none"></TableCell>
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
                    toggleStockExpansion(portfolioStock, setExpandedStock)
                  }
                  stockData={portfolioStocks.find(
                    (s) => s.id === portfolioStock.stock.id
                  )}
                  transactions={filterTransactions(
                    transactions,
                    portfolioStock
                  )}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
      color: (theme) => theme.palette.mode == 'dark' ? theme.palette.text.primary : 'black',
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
    }}
  >
    <Typography sx={{ color: (theme) => theme.palette.mode == 'dark' ? theme.palette.text.primary : 'black', }} variant="body1">{label}:</Typography>
    <Typography variant="body1" sx={{ color: (theme) => theme.palette.mode == 'dark' ? theme.palette.text.primary : 'black', fontWeight: 600 }}>
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
          <Typography variant="subtitle2">Your portfolios</Typography>
          <Typography variant="caption" color="text.secondary">
            Only you can see this
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ color: (theme) => theme.palette.mode == 'dark' ? theme.palette.text.primary : 'black', }} variant="h4" gutterBottom>
        {formatCurr(portfolio?.total)}
      </Typography>
      <PortfolioSummary portfolio={portfolio} />
      <Button
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

const toggleStockExpansion = (portfolioStock, setExpandedStock) => {
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

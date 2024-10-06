import StockList from "@/components/dashboard/StockList";
import useDebounce from "@/hooks/useDebounce";
import { db as firestore } from "@/lib/firebase/init";
import { formatCurr, formatPercent } from "@/utils/format-number";
import {
  convertFirebaseTimestampToDate,
  TransactionTypeMap,
  TransactionTypeMapBuyMap,
} from "@/utils/timestamp";
import { Edit, ExpandLess, ExpandMore, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  InputAdornment,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { PageContainer } from "@toolpad/core";
import firebase from "firebase/compat/app";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const StockRow = ({
  portfolioStock,
  expanded,
  onToggle,
  stockData,
  transactions,
}) => {
  let gain =
    (stockData?.price - portfolioStock?.price || 0) *
    (portfolioStock?.shares || 0);
  let gainInPercent = (stockData?.price * 100) / portfolioStock?.price - 100;

  if (portfolioStock.type === "SHORT SELL") {
    gain = -gain;
    gainInPercent = -gainInPercent;
  }

  const router = useRouter();

  return (
    <>
      <TableRow>
        <TableCell>
          <Box
            display="flex"
            alignItems="center"
            sx={{
              cursor: "pointer",
            }}
            onClick={() => router.push(`/stocks/${portfolioStock.stock.id}`)}
          >
            <Box
              component="span"
              sx={{
                backgroundColor:
                  portfolioStock.symbol === "AAPL" ? "#6e6e6e" : "#76b82a",
                color: "white",
                padding: "2px 8px",
                borderRadius: "4px",
                marginRight: "8px",
              }}
            >
              {stockData?.symbol}
            </Box>
            {stockData?.name}
          </Box>
        </TableCell>
        <TableCell align="right">{formatCurr(stockData?.price)}</TableCell>
        <TableCell align="right">
          {portfolioStock.shares}
          {portfolioStock.symbol === "NVDA" && (
            <Edit
              fontSize="small"
              sx={{ marginLeft: "4px", color: "action.active" }}
            />
          )}
        </TableCell>
        <TableCell
          align="right"
          sx={{
            color: gain >= 0 ? "success.main" : "error.main",
          }}
        >
          <Typography component="span" mr={1}>
            {formatCurr(gain)}
          </Typography>
          <Typography component="span">
            {gainInPercent >= 0 ? "▲" : "▼"} {formatPercent(gainInPercent)}
          </Typography>
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
      {expanded && (
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
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((purchase, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {moment(
                        convertFirebaseTimestampToDate(purchase.createdAt)
                      ).format("DD MMM YYYY, hh:mm A")}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurr(purchase.price)}
                    </TableCell>
                    <TableCell align="right">{purchase.quantity}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          purchase.profitLoss >= 0
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {purchase.profitLoss !== null ? (
                        <>{formatCurr(purchase.profitLoss)}</>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurr(purchase.quantity * purchase.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
const PortfolioDetails = ({ portfolio, open, onClose }) => {
  const [expandedStock, setExpandedStock] = useState([]);
  const [portfolioStocks, setPortfolioStocks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!portfolio || !open) return;
    const fetchStockData = async () => {
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

      const data = stocks.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const transactionData = transactions.docs.map((doc) => doc.data());
      setPortfolioStocks(data);
      setTransactions(transactionData);
    };

    fetchStockData();
  }, [portfolio, open]);

  if (!portfolio) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Portfolio Details</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SYMBOL NAME</TableCell>
              <TableCell align="right">PRICE</TableCell>
              <TableCell align="right">QUANTITY</TableCell>
              <TableCell align="right">GAIN</TableCell>
              <TableCell align="right">VALUE</TableCell>
              <TableCell align="right">TYPE</TableCell>

              <TableCell padding="none" />
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolio.data.map((portfolioStock) => {
              const rowId = portfolioStock.stock.id + portfolioStock.type;
              return (
                <StockRow
                  key={rowId}
                  portfolioStock={portfolioStock}
                  expanded={expandedStock.includes(rowId)}
                  onToggle={() =>
                    setExpandedStock((prev) =>
                      prev.includes(rowId)
                        ? prev.filter((id) => id !== rowId)
                        : [...prev, rowId]
                    )
                  }
                  stockData={portfolioStocks.find(
                    (s) => s.id === portfolioStock.stock.id
                  )}
                  transactions={transactions.filter(
                    (t) =>
                      t.stock.id === portfolioStock.stock.id &&
                      TransactionTypeMapBuyMap[portfolioStock.type].includes(
                        t.type
                      )
                  )}
                />
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};
export default function StockDashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openPortfolioDetails, setOpenPortfolioDetails] = useState(false);

  const searchDebounce = useDebounce(search, 500);

  const portfolio = useSelector((state) => state.firestore.data.firestoreUser);

  const allStocks = useSelector((state) => state.settings.stocks);
  const allStocksArray = Object.values(allStocks);
  const sortedAllStocks = allStocksArray
    ?.sort((a, b) => a.symbol.localeCompare(b.symbol))
    .filter((stock) => {
      if (searchDebounce) {
        return (
          stock.symbol.toLowerCase().includes(searchDebounce.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchDebounce.toLowerCase())
        );
      }
      return true;
    });

  return (
    <PageContainer title="" breadCrumbs={[]}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          flexDirection: "column",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for stocks, ETFs & more"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: (theme) => theme.palette.text.primary,
                    }}
                  />
                </InputAdornment>
              ),
            },
            htmlInput: {
              sx: {
                "&::placeholder": {
                  color: (theme) => theme.palette.text.primary,
                  opacity: 1,
                },
              },
            },
          }}
          sx={{
            backgroundColor: (theme) => theme.palette.background.paper,
            borderRadius: 12,
            boxShadow: 2,
            maxWidth: 600,
            margin: "0 auto",
            border: "none",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
              borderRadius: 12,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
              border: "none",
            },
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
              border: "none",
            },
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Grid2 container spacing={3}>
          <Grid2
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <Card>
              <CardContent>
                <Box
                  sx={{
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.divider}`,
                    pb: 1,
                  }}
                >
                  <Typography variant="h6">All Stocks</Typography>
                </Box>
                <StockList
                  pageNumber={page}
                  startAt={sortedAllStocks[(page - 1) * 10]}
                  searchSymbols={
                    searchDebounce
                      ? sortedAllStocks.map((stock) => stock.symbol)
                      : undefined
                  }
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                  }}
                >
                  <Pagination
                    count={Math.ceil((sortedAllStocks?.length || 0) / 10)}
                    page={page}
                    onChange={(e, p) => setPage(p)}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid2>
          <Grid2
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#e8f0fe",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
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
                <Typography variant="h4" gutterBottom>
                  {formatCurr(portfolio?.total)}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography variant="body1">Invested:</Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {formatCurr(portfolio?.invested)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography variant="body1">Remaining:</Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {formatCurr(portfolio?.remaining)}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setOpenPortfolioDetails(true)}
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Card>
              <CardHeader title="News" />
              <CardContent></CardContent>
            </Card>
          </Grid2>
        </Grid2>
      </Box>
      <PortfolioDetails
        open={openPortfolioDetails}
        onClose={() => setOpenPortfolioDetails(false)}
        portfolio={portfolio}
      />
    </PageContainer>
  );
}

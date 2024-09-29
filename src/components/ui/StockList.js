import React, { useEffect, useState } from "react";
import PortfolioCard from "./PortfolioCard";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StockUpArrow from "./StockUpArrow";
import StockDownArrow from "./StockDownArrow";
import { useTheme } from '@mui/material/styles';

const initialStocks = [
  { name: "Apple", symbol: "AAPL", price: 150, change: -1.25, percentage: -0.83, positive: false },
  { name: "Google", symbol: "GOOGL", price: 2800, change: 15.6, percentage: 0.56, positive: true },
  { name: "Amazon", symbol: "AMZN", price: 3400, change: -12.9, percentage: -0.38, positive: false },
  { name: "Microsoft", symbol: "MSFT", price: 299, change: 2.45, percentage: 0.82, positive: true },
  { name: "Tesla", symbol: "TSLA", price: 720, change: -9.20, percentage: -1.27, positive: false },
];

const getRandomChange = () => {
  const change = (Math.random() * 20 - 10).toFixed(2);
  return parseFloat(change);
};

const updateStocks = (stocks) => {
  return stocks.map(stock => {
    const change = getRandomChange();
    const newPrice = stock.price + change;
    const percentage = ((change / stock.price) * 100).toFixed(2);
    return {
      ...stock,
      price: newPrice,
      change: change,
      percentage: percentage,
      positive: change >= 0,
    };
  });
};

const StockList = () => {
  const theme = useTheme();
  const [stocks, setStocks] = useState(initialStocks);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // For responsiveness

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => updateStocks(prevStocks));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      {/* Stock List */}
      <Box
        sx={{
          flex: 3, // Stock list takes more space
          marginRight: isMobile ? '0' : '1rem', // Add margin on larger screens
        }}
      >
        <TableContainer component={Paper} sx={{ borderRadius: 2, maxWidth: '100%' }}>
          <Table>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow
                  key={stock.symbol}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {stock.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{stock.symbol}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }} variant="body2">
                      ₹{stock.price.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{ color: stock.positive ? green[400] : red[400], fontWeight: 'bold', fontSize: '1.2rem' }}
                    >
                      {stock.positive ? `+₹${stock.change.toFixed(2)}` : `-₹${Math.abs(stock.change).toFixed(2)}`}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{ color: stock.positive ? green[400] : red[400], fontWeight: 'bold', fontSize: '1.2rem' }}
                    >
                      {stock.positive ? <StockUpArrow /> : <StockDownArrow />} {Math.abs(stock.percentage).toFixed(2)}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      sx={{
                        '&:hover': {
                          transform: 'scale(1.1)',
                          transition: 'transform 0.2s',
                        },
                      }}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Portfolio Card */}
      {!isMobile && (
        <Box sx={{ flex: 1 }}>
          <PortfolioCard />
        </Box>
      )}
    </Box>
  );
};

export default StockList;

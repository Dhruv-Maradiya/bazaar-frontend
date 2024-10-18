import React, { memo } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  Avatar,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { green, red } from "@mui/material/colors";
import { formatCurr, formatPercent } from "@/utils/format-number";

const StockSymbol = ({ name, id, onClick }) => (
  <Box
    sx={{
      flex: { xs: 1, lg: 0.4 },
      display: "flex",
      alignItems: "center",
      gap: 1,
      cursor: "pointer",
    }}
    onClick={onClick}
  >
    <Avatar src={`/images/stocks/${id}.png`} alt={name} />
    <Typography variant="subtitle1">{name}</Typography>
  </Box>
);

const StockPrice = ({ price, isDownLg }) => (
  <Box sx={{ flex: { xs: "auto", lg: 0.2 } }}>
    <Typography
      variant="body1"
      sx={{
        fontWeight: 800,
        textAlign: isDownLg ? "right" : "left",
      }}
    >
      {formatCurr(price)}
    </Typography>
  </Box>
);

const StockChange = ({ change, theme }) => (
  <Box sx={{ flex: { xs: 1, lg: 0.2 } }}>
    <Typography
      sx={{
        color:
          change > 0
            ? theme.palette.mode === "dark"
              ? green[500]
              : green[600]
            : theme.palette.mode === "dark"
              ? red[400]
              : red[600],
        textWrap: "nowrap",
      }}
    >
      {(change > 0 ? "+" : "") + formatCurr(change)}
    </Typography>
  </Box>
);

const StockChangePercent = ({ changePercent, change }) => (
  <Box
    sx={{
      flex: 0.1,
      display: "flex",
      alignItems: "center",
      backgroundColor: change > 0 ? green[50] : red[50],
      borderRadius: 1,
      padding: "4px 8px",
    }}
  >
    {change > 0 ? (
      <ArrowUpwardIcon
        color="success"
        fontSize="small"
        sx={{ fontWeight: 600 }}
      />
    ) : (
      <ArrowDownwardIcon
        color="error"
        fontSize="small"
        sx={{ fontWeight: 500 }}
      />
    )}
    <Typography
      sx={{ color: change > 0 ? green[700] : red[700], fontWeight: 500 }}
    >
      {formatPercent(changePercent)}
    </Typography>
  </Box>
);

const StockItem = ({ stock, isTablet, isDownLg, isMobile, theme, onClick }) => {
  const commonProps = {
    stockSymbol: (
      <StockSymbol name={stock.symbol} id={stock.id} onClick={onClick} />
    ),
    stockPrice: <StockPrice price={stock.price} isDownLg={isDownLg} />,
    stockChange: <StockChange change={stock.change} theme={theme} />,
    stockChangePercent: (
      <StockChangePercent
        changePercent={stock.changePercent}
        change={stock.change}
      />
    ),
  };

  if (isTablet || isDownLg) {
    return (
      <Box
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          paddingY: "6px",
          paddingX: isMobile ? 0 : "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          {commonProps.stockSymbol}
          {commonProps.stockPrice}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          {commonProps.stockChange}
          {commonProps.stockChangePercent}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: "12px 0",
        display: "flex",
        alignItems: "center",
      }}
    >
      {Object.values(commonProps)}
    </Box>
  );
};

const StockList = ({ searchSymbols }) => {
  const stocks = useSelector((state) => state.firestore.data.dashboardStocks);
  const theme = useTheme();
  const router = useRouter();
  const isDownLg = useMediaQuery(theme.breakpoints.down("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!stocks || (searchSymbols && searchSymbols.length === 0)) {
    return (
      <Box
        sx={{
          display: "flex",
          mt: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">No stocks found</Typography>
      </Box>
    );
  }

  const stocksArray = Object.values(stocks).map((stock) => ({
    ...stock,
    change: stock.price - stock.open,
    changePercent: ((stock.price - stock.open) / stock.open) * 100,
  }));

  return stocksArray.map((stock) => (
    <StockItem
      key={stock.id}
      stock={stock}
      isTablet={isTablet}
      isDownLg={isDownLg}
      isMobile={isMobile}
      theme={theme}
      onClick={() => router.push(`/stocks/${stock.id}`)}
    />
  ));
};

export default memo(StockList);

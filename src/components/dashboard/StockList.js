import { Chip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { formatCurr, formatPercent } from "@/utils/format-number";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { green, red } from "@mui/material/colors";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { memo } from "react";

const StockList = ({ searchSymbols }) => {
  const stocks = useSelector((state) => state.firestore.data.dashboardStocks);
  const router = useRouter();

  if (!stocks || (searchSymbols && searchSymbols.length === 0))
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

  const stocksArray = Object.values(stocks).map((stock) => ({
    ...stock,
    change: stock.price - stock.open,
    changePercent: ((stock.price - stock.open) / stock.open) * 100,
  }));

  return stocksArray.map((stock, index) => (
    <Box
      key={stock.symbol}
      sx={{
        borderBottom: (theme) =>
          index + 1 !== stocks.length
            ? `1px solid ${theme.palette.divider}`
            : null,
        padding: "12px 0",
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
      }}
    >
      <Box
        sx={{
          flex: {
            xs: 'none',
            sm: 0.4,
          },
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
        }}
        onClick={() => {
          router.push(`/stocks/${stock.id}`);
        }}
      >
        <Chip
          label={stock.symbol}
          size="small"
          sx={{
            backgroundColor: "#76b82a",
            color: (theme) => theme.palette.common.white,
            borderRadius: 1,
            display: { xs: 'none', sm: 'block' },
          }}
        />
        <Typography variant="subtitle1">{stock.name}</Typography>
      </Box>

      <Box
        sx={{
          flex: {
            xs: 'none',
            sm: 0.2,
          },
          textAlign: {
            xs: 'left',
            sm: 'left',
          },
          marginTop: { xs: 1, sm: 0 },
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 800 }}>
          {formatCurr(stock.price)}
        </Typography>
      </Box>

      <Box
        sx={{
          flexDirection: {
            xs: 'row',
            sm: 'column',
            lg: "row",
          },
          display: 'flex',
          alignItems: 'center',
          justifyContent: {
            xs: 'space-between',
            sm: 'flex-start',
          },
          marginTop: { xs: '4px', sm: '0' },
          position: {
            lg: "absolute",
          },
          right: {
            lg: "35rem"
          }
        }}
      >
        <Typography
          sx={{
            color: (theme) =>
              stock.change > 0
                ? theme.palette.mode === "dark"
                  ? green[500]
                  : green[600]
                : theme.palette.mode === "dark"
                  ? red[400]
                  : red[600],
            marginRight: { xs: '8px', sm: '0' },
            textAlign: 'left',
            flexGrow: 1,
          }}
        >
          {stock.change > 0 ? "+" : ""}
          {formatCurr(stock.change)}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: stock.change > 0 ? green[50] : red[50],
            borderRadius: 1,
            padding: "4px 8px",
            marginLeft:{
              lg:"2rem",
            }
          }}>
          {stock.change > 0 ? (
            <ArrowUpwardIcon color="success" fontSize="small" />
          ) : (
            <ArrowDownwardIcon color="error" fontSize="small" />
          )}
          <Typography
            sx={{
              color: stock.change > 0 ? green[700] : red[700],
              fontWeight: 500,
              marginLeft: '4px',
            }}
          >
            {formatPercent(stock.changePercent)}
          </Typography>
        </Box>
      </Box>
    </Box>
  ));
};

export default memo(StockList);

import {
  calculateChangeInPercentage,
  calculateChangeInValue,
} from "@/utils/change";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Button,
  Chip,
  Divider,
  IconButton,
  Breadcrumbs as MuiBreadcrumbs,
  Tooltip,
  Typography,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/system";
import { compose } from "@reduxjs/toolkit";
import Link from "next/link";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { formatPercent, formatCurr } from "@/utils/format-number";
import StockChart from "./StockChart";
import { useMemo, useState } from "react";
import SellIcon from "@mui/icons-material/Sell";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Buy from "./actions/Buy";
import Sell from "./actions/Sell";
import { useSelector } from "react-redux";

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.palette.text.secondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
`;

const Breadcrumbs = ({ currentPage }) => (
  <MuiBreadcrumbs
    separator={
      <NavigateNextIcon
        sx={{
          fontSize: (theme) => theme.typography.body1.fontSize,
          color: (theme) => theme.palette.text.secondary,
        }}
      />
    }
  >
    {[
      <StyledLink href="/" key="Home">
        Home
      </StyledLink>,

      <Typography
        key="NIFTY 50"
        sx={{
          color: (theme) => theme.palette.text.primary,
          fontWeight: "600",
        }}
        variant="caption"
      >
        {currentPage}
      </Typography>,
    ]}
  </MuiBreadcrumbs>
);

const StockDetailsView = (props) => {
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [buyType, setBuyType] = useState("BUY");
  const [sellType, setSellType] = useState("SELL");

  const stock = useSelector(
    (state) => state.firestore.data?.stocks?.[props.stockId]
  );
  const candles = useSelector((state) => state.firestore.data.candles);

  const { changeInPercentage, changeInValue } = useMemo(() => {
    if (!stock) return {};

    return {
      changeInPercentage: calculateChangeInPercentage(stock.open, stock.price),
      changeInValue: calculateChangeInValue(stock.open, stock.price),
    };
  }, [stock]);

  if (!stock) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        flexDirection: "column",
      }}
    >
      <Stack gap={1}>
        <Breadcrumbs currentPage={stock.name} />
        <Typography variant="h5">{stock.name}</Typography>
        <Divider />
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Typography variant="h5" fontWeight="600">
                {formatCurr(stock.price)}
              </Typography>
              <Chip
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      disableRipple
                      sx={{
                        p: 0,
                      }}
                    >
                      {changeInPercentage > 0 ? (
                        <ArrowUpwardIcon color="success" fontSize="small" />
                      ) : (
                        <ArrowDownwardIcon color="error" fontSize="small" />
                      )}
                    </IconButton>
                    <Typography variant="body2" fontWeight="bold">
                      {formatPercent(changeInPercentage)}
                    </Typography>
                  </Box>
                }
                sx={{
                  backgroundColor:
                    changeInPercentage > 0 ? green[100] : red[100],
                  color: changeInPercentage > 0 ? green[900] : red[600],
                  borderRadius: 2,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: changeInPercentage > 0 ? green[600] : red[600],
                }}
              >
                {formatCurr(changeInValue)} Today
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <StockChart candles={candles} />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tooltip title="Buy" arrow>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => {
                    setBuyOpen(true);
                    setBuyType("BUY");
                  }}
                >
                  Buy
                </Button>
              </Tooltip>
              <Tooltip title="Sell" arrow>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<SellIcon />}
                  onClick={() => {
                    setSellOpen(true);
                    setSellType("SELL");
                  }}
                >
                  Sell
                </Button>
              </Tooltip>
              <Tooltip title="Short Sell" arrow>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShowChartIcon />}
                  onClick={() => {
                    setBuyOpen(true);
                    setBuyType("SHORT SELL");
                  }}
                >
                  Short Sell
                </Button>
              </Tooltip>
              <Tooltip title="Square Off" arrow>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<CheckBoxIcon />}
                  onClick={() => {
                    setSellOpen(true);
                    setSellType("SQUARE OFF");
                  }}
                >
                  Square Off
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Stack>
      <Buy
        stock={stock}
        open={buyOpen}
        handleClose={() => setBuyOpen(false)}
        type={buyType}
      />
      <Sell
        stock={stock}
        open={sellOpen}
        handleClose={() => setSellOpen(false)}
        type={sellType}
      />
    </Box>
  );
};

export default compose(
  firestoreConnect((props) => [
    { collection: "stocks", doc: props.stockId },
    {
      collection: "stocks",
      doc: props.stockId,
      subcollections: [{ collection: "candles" }],
      storeAs: "candles",
    },
  ])
)(StockDetailsView);

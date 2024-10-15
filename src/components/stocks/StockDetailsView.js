import {
  calculateChangeInPercentage,
  calculateChangeInValue,
} from "@/utils/change";
import { formatCurr, formatPercent } from "@/utils/format-number";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SellIcon from "@mui/icons-material/Sell";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
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
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Buy from "./actions/Buy";
import Sell from "./actions/Sell";
// import StockChartOld from "./StockChartOld";
import { addCandles, removeCandles, updateCandles } from "@/store/candles";
import { convertFirebaseTimestampToDate } from "@/utils/timestamp";
import { compose } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { firestoreConnect, useFirestore } from "react-redux-firebase";
import StockChart from "./StockChart";

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

const StockDetailsView = ({ stockId, drawerRef }) => {
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [buyType, setBuyType] = useState("BUY");
  const [sellType, setSellType] = useState("SELL");

  const stock = useSelector((state) => state.firestore.data?.stocks?.[stockId]);
  const candlesDictionary = useSelector(
    (state) => state.candles[stockId] || [],
  );
  const candles = Object.values(candlesDictionary);

  const dispatch = useDispatch();

  const firestore = useFirestore();

  const { changeInPercentage, changeInValue } = useMemo(() => {
    if (!stock) return {};

    return {
      changeInPercentage: calculateChangeInPercentage(stock.open, stock.price),
      changeInValue: calculateChangeInValue(stock.open, stock.price),
    };
  }, [stock]);

  useEffect(() => {
    const lastCandle = candles?.sort(
      (a, b) => b.startAt.seconds - a.startAt.seconds,
    )[0];

    const candlesRef = firestore
      .collection("stocks")
      .doc(stockId)
      .collection("candles");

    let query = candlesRef;

    if (lastCandle) {
      query = query.where(
        "startAt",
        ">",
        convertFirebaseTimestampToDate(lastCandle.startAt),
      );
    }

    const unsubscribe = query.onSnapshot((snapshot) => {
      const addedCandles = [];
      const modifiedCandles = [];
      const removedCandles = [];

      snapshot.docChanges().forEach((change) => {
        const candle = change.doc.data();
        if (change.type === "added") {
          addedCandles.push({
            ...candle,
            id: change.doc.id,
          });
        }
        if (change.type === "modified") {
          modifiedCandles.push({
            ...candle,
            id: change.doc.id,
          });
        }
        if (change.type === "removed") {
          removedCandles.push(change.doc.id);
        }
      });

      if (addedCandles.length) {
        dispatch(addCandles({ stockId, candles: addedCandles }));
      }

      if (modifiedCandles.length) {
        dispatch(updateCandles({ stockId, candles: modifiedCandles }));
      }

      if (removedCandles.length) {
        dispatch(removeCandles({ stockId, candleIds: removedCandles }));
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, stockId]);

  if (!stock) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        flexDirection: "column",
        width: "100%",
        mt: "80px",
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
              <StockChart
                candles={candles}
                drawerRef={drawerRef}
                stockId={stockId}
              />
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
  firestoreConnect((props) => {
    return [{ collection: "stocks", doc: props.stockId }];
  }),
)(StockDetailsView);

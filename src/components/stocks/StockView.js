import { Box } from "@mui/system";
import React, { memo } from "react";
import TrendingStocks from "./TrendingStocks";
import StockDetailsView from "./StockDetailsView";


const StockView = ({ stockId, drawerRef }) => {
  return (
    <Box
      sx={{
        gap: 3,
        display: "flex",
        flexDirection: "column",
        p: 3,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <TrendingStocks stockId={stockId} />
      <StockDetailsView stockId={stockId} drawerRef={drawerRef} />
    </Box>
  );
};

export default memo(StockView);

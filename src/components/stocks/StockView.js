import { Box } from "@mui/system";
import { memo } from "react";
import StockDetailsView from "./StockDetailsView";
import TrendingStocks from "./TrendingStocks";

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
      <TrendingStocks stockId={stockId} top={10} />
      <StockDetailsView stockId={stockId} drawerRef={drawerRef} />
    </Box>
  );
};

export default memo(StockView);

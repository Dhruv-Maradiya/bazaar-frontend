import StockDetailsView from "@/components/stocks/StockDetailsView";
import TrendingStocks from "@/components/stocks/TrendingStocks";
import { Box } from "@mui/system";
import { useParams } from "next/navigation";

const StockDetails = () => {
  const params = useParams();

  if (!params || !params.id) {
    return null;
  }

  return (
    <Box
      sx={{
        gap: 3,
        display: "flex",
        flexDirection: "column",
        p: 3,
      }}
    >
      <TrendingStocks />
      <StockDetailsView stockId={params.id} />
    </Box>
  );
};

export default StockDetails;

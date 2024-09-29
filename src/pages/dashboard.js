import SearchBar from "@/components/SearchBar";
import StockList from "@/components/ui/StockList";
import WatchList from "@/components/ui/WatchList";
import { Box } from "@mui/material";

const Dashboard = () => {
  return (
    <Box>
      <SearchBar />
      <StockList />
    </Box>
  )
};

export default Dashboard;

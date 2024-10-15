import { Box } from "@mui/system";
import InlineStock from "./InlineStock";
import Marquee from "react-fast-marquee";
import { db as firestore } from "@/lib/firebase/init";
import { useEffect, useState } from "react";

const fetchStocks = async () => {
  const stocks = await firestore.collection("stocks").get();
  return stocks.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
const TrendingStocks = ({ stockId, top }) => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const _fetch = async () => {
      const _stocks = await fetchStocks();
      setStocks(_stocks);
    };

    _fetch();
  }, []);

  return (
    <Box
      sx={{
        whiteSpace: "nowrap",
        maxWidth: "100vw",
        position: "absolute",
        overflowX: "hidden",
        maxHeight: "80px",
        top: top || 0,
      }}
    >
      <Marquee
        autoFill
        speed={60}
        pauseOnHover
        onCycleComplete={async () => {
          const _stocks = await fetchStocks();
          setStocks(_stocks);
        }}
      >
        {stocks
          .filter((stock) => stock.id !== stockId)
          .map((stock) => (
            <InlineStock key={stock.id} stock={stock} />
          ))}
      </Marquee>
    </Box>
  );
};

export default TrendingStocks;

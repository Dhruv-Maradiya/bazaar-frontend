import StockView from "@/components/stocks/StockView";
import { useParams } from "next/navigation";

const StockDetails = () => {
  const params = useParams();

  return <StockView stockId={params.id} />;
};

export default StockDetails;

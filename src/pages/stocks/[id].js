import StockView from "@/components/stocks/StockView";
import { useParams } from "next/navigation";

const StockDetails = ({ drawerRef }) => {
  const params = useParams();

  if (!params?.id) return null;

  return <StockView stockId={params.id} drawerRef={drawerRef} />;
};

export default StockDetails;

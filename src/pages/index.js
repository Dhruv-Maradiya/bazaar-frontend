import Dashboard from "@/components/dashboard/Dashboard";
import { PageContainer } from "@toolpad/core";

import { useState } from "react";
import { useSelector } from "react-redux";
import useDebounce from "@/hooks/useDebounce";

export default function StockDashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchDebounce = useDebounce(search, 500);

  const allStocks = useSelector((state) => state.settings.stocks);
  const allStocksArray = Object.values(allStocks);
  const sortedAllStocks = allStocksArray
    ?.sort((a, b) => a.symbol.localeCompare(b.symbol))
    .filter((stock) => {
      if (searchDebounce) {
        return (
          stock.symbol.toLowerCase().includes(searchDebounce.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchDebounce.toLowerCase())
        );
      }
      return true;
    });

  return (
    <PageContainer title="" breadCrumbs={[]}>
      <Dashboard
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        searchDebounce={searchDebounce}
        sortedAllStocks={sortedAllStocks}
        searchSymbols={
          searchDebounce
            ? sortedAllStocks.map((stock) => stock.symbol)
            : undefined
        }
      />
    </PageContainer>
  );
}

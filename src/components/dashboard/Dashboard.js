import News from "@/components/dashboard/News";
import Portfolio from "@/components/dashboard/Portfolio";
import Searchbar from "@/components/dashboard/Searchbar";
import StockList from "@/components/dashboard/StockList";
import {
  Box,
  Card,
  CardContent,
  Grid2,
  Pagination,
  Typography,
} from "@mui/material";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "@reduxjs/toolkit";
import { memo } from "react";

const Dashboard = ({
  page,
  setPage,
  search,
  setSearch,
  searchDebounce,
  sortedAllStocks,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 3,
        flexDirection: "column",
      }}
    >
      <Searchbar value={search} onChange={(val) => setSearch(val)} />
      <Grid2 container spacing={3}>
        <Grid2
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <Card>
            <CardContent>
              <Box
                sx={{
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  pb: 1,
                }}
              >
                <Typography variant="h6">All Stocks</Typography>
              </Box>
              <StockList
                pageNumber={page}
                startAt={sortedAllStocks[(page - 1) * 10]}
                searchSymbols={
                  searchDebounce
                    ? sortedAllStocks.map((stock) => stock.symbol)
                    : undefined
                }
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Pagination
                  count={Math.ceil((sortedAllStocks?.length || 0) / 10)}
                  page={page}
                  onChange={(e, p) => setPage(p)}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card>
            <CardContent>
              <Portfolio />
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">News</Typography>
            <News />
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default compose(
  firestoreConnect((props) => {
    if (props.searchSymbols && props.searchSymbols.length === 0) return [];

    return [
      {
        collection: "stocks",
        limit: 10,
        orderBy: ["symbol"],
        where: props.searchSymbols
          ? ["symbol", "in", props.searchSymbols]
          : null,
        startAt: props.startAt?.symbol,
        storeAs: "dashboardStocks",
      },
    ];
  })
)(memo(Dashboard));

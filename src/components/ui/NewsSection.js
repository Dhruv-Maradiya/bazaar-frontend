import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";

const dummyNewsData = {
  topStories: [
    {
      title: "IPO-bound Swiggy is betting big on quick commerce",
      source: "Business Today",
      time: "2 hours ago",
      image:
        "https://akm-img-a-in.tosshub.com/businesstoday/images/story/202409/66f929999c9f4-the-ipo-is-expected-to-raise-around-rs-10-000-crore--with-a-fresh-issue-worth-rs-3-750-crore-and-an-291904462-16x9.png?size=948:533",
    },
    {
      title:
        "Trade Spotlight: How should you trade Tata Steel, Polycab, Chambal Fertilisers, Canara Bank, Vedanta and...",
      source: "Moneycontrol",
      time: "7 hours ago",
      image:
        "https://images.moneycontrol.com/static-mcnews/2023/10/trading-market.jpg?impolicy=website&width=770&height=431",
    },
  ],
  localMarket: [],
  worldMarkets: [],
};

const NewsSection = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        {`Bazaar`} Financial News
      </Typography>
      <Tabs value={value} onChange={handleChange} aria-label="news tabs">
        <Tab label="Top Stories" />
        <Tab label="Local Market" />
        <Tab label="World Markets" />
      </Tabs>
      <Box sx={{ paddingTop: 2 }}>
        {value === 0 &&
          dummyNewsData.topStories.map((news, index) => (
            <Card key={index} sx={{ display: "flex", marginBottom: 2 }}>
              <CardMedia
                component="img"
                sx={{ width: 120 }}
                image={news.image}
                alt="News image"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {news.source} - {news.time}
                </Typography>
                <Typography variant="subtitle1">{news.title}</Typography>
              </CardContent>
            </Card>
          ))}
      </Box>
      <Box
        sx={{
          marginTop: 2,
          padding: 2,
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
          NIFTY 50
        </Typography>
        <Typography
          variant="body1"
          color="error"
          sx={{ fontWeight: "bold", marginTop: 1, color: "#333" }}
        >
          -0.16%
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginTop: 1, color: "#333" }}
        >
          Last updated: 29 Sep 2024, 19:07 IST
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginTop: 0.5, color: "#333" }}
        >
          Market Status: Closed
        </Typography>
      </Box>
    </Container>
  );
};

export default NewsSection;

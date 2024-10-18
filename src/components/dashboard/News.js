import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import moment from "moment";
import { convertFirebaseTimestampToDate } from "@/utils/timestamp";

const NewsItem = ({ title, releaseAt, description, source }) => {
  const [newsSince, setNewsSince] = useState(
    moment(convertFirebaseTimestampToDate(releaseAt)).fromNow()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsSince(moment(convertFirebaseTimestampToDate(releaseAt)).fromNow());
    }, 10000);

    return () => clearInterval(interval);
  }, [releaseAt]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {newsSince}
        </Typography>
        <Typography variant="body1" paragraph>
          {description}
        </Typography>
        {source && (
          <Link
            href={source}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <Typography
              variant="caption"
              color="primary"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              View Source
            </Typography>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

const EmptyNewsCard = () => (
  <Card
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: 100,
    }}
  >
    <CardContent>
      <Typography variant="body1">No news found!</Typography>
    </CardContent>
  </Card>
);

const News = () => {
  const news = useSelector((state) => state.firestore.data.dashboardNews);

  if (!news || Object.keys(news).length === 0) {
    return <EmptyNewsCard />;
  }

  const sortedNews = Object.entries(news)
    .map(([id, item]) => ({ id, ...item }))
    .filter((item) => item.title)
    .sort((a, b) => {
      const aDate = convertFirebaseTimestampToDate(a.releaseAt);
      const bDate = convertFirebaseTimestampToDate(b.releaseAt);
      return bDate - aDate;
    });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {sortedNews.map((item) => (
        <NewsItem key={item.id} {...item} />
      ))}
    </Box>
  );
};

export default News;

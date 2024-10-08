import { convertFirebaseTimestampToDate } from "@/utils/timestamp";
import { Box, Card, CardContent, Typography } from "@mui/material";
import moment from "moment";
import Link from "next/link";
import { useSelector } from "react-redux";

const News = () => {
  //   const news = [];
  const news = useSelector((state) => state.firestore.data.dashboardNews);

  if (!news || Object.keys(news).length === 0)
    return (
      <Card
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardContent>No news found!</CardContent>
      </Card>
    );

  const newsArray = Object.keys(news).map((key) => ({
    id: key,
    ...news[key],
  }));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {newsArray?.map((item) => (
        <Card key={item.id}>
          <CardContent>
            <Box>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="caption">
                {moment(
                  convertFirebaseTimestampToDate(item.releaseAt)
                ).fromNow()}
              </Typography>
            </Box>
            <Typography variant="body1">{item.description}</Typography>
            {item.source && (
              <Link
                href={item.source}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{
                    cursor: "pointer",
                    textDecoration: "none !important",
                  }}
                >
                  View Sources
                </Typography>
              </Link>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default News;

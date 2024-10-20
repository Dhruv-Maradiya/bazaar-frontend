import { formatCurr, formatPercent } from "@/utils/format-number";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  keyframes,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import { db as firestore } from "@/lib/firebase/init";
import { useEffect, useState } from "react";

const CustomChip = ({ children, ...props }) => {
  const { sx } = props;

  delete props.sx;

  return (
    <Chip
      size="small"
      sx={{
        fontWeight: "bold",
        borderRadius: 1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Chip>
  );
};

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export default function LeaderBoard() {
  const [leaderBoardData, setLeaderBoardData] = useState([]);

  useEffect(() => {
    const fetchLeaderBoardData = async () => {
      const leaderBoard = await firestore
        .collection("users")
        .where("eligibleForLeaderBoard", "==", true)
        .orderBy("total", "desc")
        .get();
      const data = leaderBoard.docs.map((doc) => doc.data());
      setLeaderBoardData(data);
    };

    fetchLeaderBoardData();
    const interval = setInterval(fetchLeaderBoardData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container
      sx={{
        marginY: 4,
      }}
    >
      <Card>
        <CardContent>
          <Typography
            variant="h4"
            textAlign="center"
            sx={{ p: 2, fontWeight: "bold" }}
            color="primary"
          >
            Investor Leaderboard
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Portfolio Value
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Change
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderBoardData.map((row, index) => {
                const change = row.total - row.initial;
                const changePercent = (change / row.initial) * 100;

                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      transition: "background-color 0.3s",
                      "&:hover": {
                        backgroundColor: (theme) => theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "primary.main",
                          color: "white",
                          fontWeight: "bold",
                          animation: `${pulseAnimation} 2s infinite`,
                        }}
                      >
                        {index + 1}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={row.avatar}
                          alt={row.name}
                          sx={{ mr: 2 }}
                        />
                        {row.name}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurr(row.total)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        {change >= 0 ? (
                          <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                        ) : (
                          <TrendingDownIcon color="error" sx={{ mr: 0.5 }} />
                        )}
                        <CustomChip
                          label={
                            <Typography
                              color={change >= 0 ? green[600] : red[600]}
                              variant="body2"
                              fontWeight="bold"
                            >
                              {change >= 0 ? "+" : ""}
                              {formatPercent(changePercent)}
                            </Typography>
                          }
                          sx={{
                            backgroundColor:
                              change >= 0 ? green[100] : red[100],
                          }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Typography
        variant="caption"
        textAlign="center"
        sx={{ mt: 2, display: "block" }}
      >
        Note: Data updates every 5 seconds
      </Typography>
    </Container>
  );
}

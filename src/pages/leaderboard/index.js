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
import { green, red, blue } from "@mui/material/colors";
import { db as firestore } from "@/lib/firebase/init";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';


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

// Define pulse animation
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

// Define fade animation
const fadeAnimation = keyframes`
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
`;

export default function LeaderBoard() {
  const [leaderBoardData, setLeaderBoardData] = useState([]);

  const nameToast = (name) => {
    toast(`Nice job, ${name}! Your portfolio is on fire 🔥`, {
      icon: '💸',
    });
  }

  useEffect(() => {
    const fetchLeaderBoardData = async () => {
      const leaderBoard = await firestore
        .collection("users")
        .where("disabled", "==", false)
        .where("eligibleForLeaderBoard", "==", true)
        .orderBy("total", "desc")
        .limit(10)
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
        marginY: { xs: 2, md: 4 },
        padding: { xs: 1, md: 3 },
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <Card variant="outlined" sx={{ borderRadius: '8px' }}>
        <CardContent>
          <Typography
            variant="h4"
            textAlign="center"
            sx={{
              p: { xs: 1, md: 2 },
              marginBottom:{
                xs:"1.5rem"
              },
              fontWeight: "bold",
              color: blue[700],
              fontSize: {
                xs: '1.5rem',
                md: '2rem',
                lg: "2.125rem"
              }
            }}
          >
            🏆 Investor Leaderboard 🏆
          </Typography>
          {/* Table for larger screens, Cards for smaller */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {leaderBoardData.map((row, index) => {
              const change = row.total - row.initial;
              const changePercent = (change / row.initial) * 100;

              return (
                <Box key={row.id} sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: 2,
                  marginBottom: 2,
                  backgroundColor: '#fff'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography  variant="h6">{index + 1}. {row.name}</Typography>
                      <Avatar src={row.avatar} alt={row.name} sx={{ display:{xs:"none"}, width: '40px', height: '40px', marginLeft: 1 }} />
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurr(row.total)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                    {change >= 0 ? (
                      <TrendingUpIcon color="success" sx={{ marginRight: 0.5 }} />
                    ) : (
                      <TrendingDownIcon color="error" sx={{ marginRight: 0.5 }} />
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
                        backgroundColor: change >= 0 ? green[100] : red[100],
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Table sx={{ display: { xs: 'none', md: 'table' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: blue[600] }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: blue[600] }}>Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", color: blue[600] }}>Portfolio Value</TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold", color: blue[600] }}>Change</TableCell>
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
                      <Box sx={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                        animation: index === 0 ? `${pulseAnimation} 2s infinite` : 'none',
                      }}>
                        {index + 1}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" , cursor:"pointer" }}>
                        <Avatar src={row.avatar} alt={row.name}
                          sx={{
                            width: { xs: '24px', md: '40px' },
                            height: { xs: '24px', md: '40px' },
                            mr: { xs: 1, md: 2 },
                          }}
                        />
                        <Typography
                          sx={{
                            animation: index < 3 ? `${pulseAnimation} 2s infinite, ${fadeAnimation} 2s infinite` : 'none',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.9rem', md: 'inherit' },
                            color: (theme) => theme.palette.mode === 'dark' ? theme.palette.text.primary : 'black',
                          }}
                        >
                          <div onClick={()=>{nameToast(row.name)}}>
                          {row.name}
                          </div>
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurr(row.total)}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        {change >= 0 ? (
                          <TrendingUpIcon color="success" sx={{ mr: { xs: 0.25, md: 0.5 } }} />
                        ) : (
                          <TrendingDownIcon color="error" sx={{ mr: { xs: 0.25, md: 0.5 } }} />
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
                            backgroundColor: change >= 0 ? green[100] : red[100],
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
        sx={{ mt: { xs: 1, md: 2 }, display: "block", color: blue[500] }}
      >
        Note: Data updates every few seconds.
      </Typography>
    </Container>
  );
}

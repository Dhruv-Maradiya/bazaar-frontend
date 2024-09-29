import { formatCurr } from "@/utils/format-number";
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

// Mock data for the leaderboard
const leaderboardData = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    portfolio: 1250000,
    change: 5.2,
    trades: 45,
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    portfolio: 980000,
    change: -2.1,
    trades: 32,
  },
  {
    id: 3,
    name: "Bob Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    portfolio: 1100000,
    change: 3.7,
    trades: 38,
  },
  {
    id: 4,
    name: "Alice Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    portfolio: 875000,
    change: 1.5,
    trades: 27,
  },
  {
    id: 5,
    name: "Charlie Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    portfolio: 1300000,
    change: -0.8,
    trades: 52,
  },
];

export default function Leaderboard() {
  return (
    <Container
      sx={{
        marginTop: 4,
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
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Trades
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboardData.map((row, index) => (
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
                      <Avatar src={row.avatar} alt={row.name} sx={{ mr: 2 }} />
                      {row.name}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurr(row.portfolio)}
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
                      {row.change > 0 ? (
                        <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                      ) : (
                        <TrendingDownIcon color="error" sx={{ mr: 0.5 }} />
                      )}
                      <CustomChip
                        label={
                          <Typography
                            color={row.change > 0 ? green[600] : red[600]}
                            variant="body2"
                            fontWeight="bold"
                          >
                            {row.change > 0 ? "+" : ""}
                            {row.change}%
                          </Typography>
                        }
                        sx={{
                          backgroundColor:
                            row.change > 0 ? green[100] : red[100],
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {row.trades}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}

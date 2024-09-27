import DashboardIcon from "@mui/icons-material/Dashboard";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PaidIcon from "@mui/icons-material/Paid";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "transactions",
    title: "Transactions",
    icon: <PaidIcon />,
  },
  {
    segment: "leaderboard",
    title: "Leaderboard",
    icon: <LeaderboardIcon />,
  },
];

export default NAVIGATION;

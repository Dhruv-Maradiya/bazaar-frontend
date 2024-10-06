import { IconButton, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import { formatCurr, formatPercent } from "@/utils/format-number";
import { green, red } from "@mui/material/colors";
import { useRouter } from "next/router";

const InlineStock = ({ stock }) => {
  const changeInValue = stock.price - stock.open;
  const positiveChange = changeInValue > 0;
  const changePercent = (changeInValue / stock.open) * 100;

  const router = useRouter();

  return (
    <Box
      sx={{
        display: "inline-block",
        padding: 1,
        whiteSpace: "nowrap",
      }}
    >
      <Box
        key={stock.symbol}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 1,
          gap: 1,
          borderRadius: 2,
          boxShadow: 1,
          backgroundColor: (theme) => theme.palette.background.paper,

          "&:hover": {
            cursor: "pointer",
            backgroundColor: (theme) => theme.palette.action.hover,
          },
        }}
        onClick={() => {
          router.push(`/stocks/${stock.id}`);
        }}
      >
        <IconButton
          sx={{
            backgroundColor: positiveChange ? green[100] : red[100],
            borderRadius: 3,
          }}
          disableRipple
        >
          {positiveChange ? (
            <NorthIcon color="success" fontSize="small" />
          ) : (
            <SouthIcon color="error" fontSize="small" />
          )}
        </IconButton>
        <Stack direction="column">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "bold",
              gap: 2,
            }}
          >
            <Typography variant="body2" fontWeight="bold" fontSize={13}>
              {stock.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: positiveChange ? "success.main" : "error.main",
              }}
              fontSize={13}
              fontWeight="bold"
            >
              {formatPercent(changePercent)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="caption">{formatCurr(stock.price)}</Typography>
            <Typography
              variant="caption"
              sx={{
                color: positiveChange ? "success.main" : "error.main",
              }}
            >
              {formatCurr(changeInValue)}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default InlineStock;

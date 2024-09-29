import { IconButton, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import { formatCurr } from "@/utils/format-number";
import { green, red } from "@mui/material/colors";

const InlineStock = ({ stock }) => {
  const changeInValue = stock.value * (stock.change / 100);
  const positiveChange = stock.change > 0;

  return (
    <Box
      key={stock.name}
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
          backgroundColor: (theme) => theme.palette.background.default,
        },
      }}
      onClick={() => {
        console.log("clicked");
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
            {stock.change}
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
          <Typography variant="caption">{formatCurr(stock.value)}</Typography>
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
  );
};

export default InlineStock;

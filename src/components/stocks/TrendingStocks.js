const { Box } = require("@mui/system");
const { default: InlineStock } = require("./InlineStock");

const topStocks = [
  {
    name: "NIFTY 50",
    value: 26510,
    change: -0.16,
  },
  {
    name: "SENSEX",
    value: 26510,
    change: 0.16,
  },
  {
    name: "NIFTY BANK",
    value: 26510,
    change: -0.16,
  },
  {
    name: "NIFTY IT",
    value: 26510,
    change: -0.16,
  },
  {
    name: "NIFTY AUTO",
    value: 26510,
    change: 0.16,
  },
];

const TrendingStocks = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {topStocks.map((stock) => (
        <InlineStock stock={stock} key={stock.name} />
      ))}
    </Box>
  );
};

export default TrendingStocks;

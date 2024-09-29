import { format } from "currency-formatter";

const formatCurr = (value, config = {}) => {
  const { currency = "INR", symbol } = config;

  return format(value, {
    code: currency,
    precision: 2,
    decimal: ".",
    thousand: ",",
    symbol: symbol,
  });
};

const formatPercent = (value) => {
  return format(value, {
    precision: 2,
    decimal: ".",
    thousand: ",",
    symbol: "%",
    format: "%v%s",
  });
};

export { formatCurr, formatPercent };

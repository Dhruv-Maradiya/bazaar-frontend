import { format } from "currency-formatter";

const formatCurr = (value, config = {}) => {
  const { currency = "INR", symbol } = config;

  if (value === null || value === undefined) {
    return "";
  }

  value = value === 0 ? 0 : value;

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

const convertToFloat = (value) => {
  return parseFloat(parseFloat(value).toFixed(2));
};

export { formatCurr, formatPercent, convertToFloat };

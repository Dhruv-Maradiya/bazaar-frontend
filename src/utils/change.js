const calculateChangeInPercentage = (oldValue, newValue) => {
  return (newValue - oldValue) / oldValue;
};
const calculateChangeInValue = (oldValue, newValue) => {
  return newValue - oldValue;
};

export { calculateChangeInPercentage, calculateChangeInValue };

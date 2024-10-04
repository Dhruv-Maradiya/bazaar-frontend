const calculateChangeInPercentage = (oldValue, newValue) => {
  return ((newValue - oldValue) / oldValue) * 100;
};
const calculateChangeInValue = (oldValue, newValue) => {
  return newValue - oldValue;
};

export { calculateChangeInPercentage, calculateChangeInValue };

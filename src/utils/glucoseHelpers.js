export const thresholds = {
  fasting: { low: 70, high: 100 },
  postMeal: { low: 70, high: 140 },
  random: { low: 70, high: 125 },
};

export const getGlucoseStatus = (value, type) => {
  if (!value) return 'unknown';
  
  const limits = thresholds[type] || thresholds.random;
  
  if (value < limits.low) return 'low';
  if (value > limits.high) {
    if (type === 'fasting' && value >= 126) return 'high'; // Diabetes range
    if (type === 'fasting' && value >= 100) return 'prediab'; // Prediabetes range
    return 'high';
  }
  return 'normal';
};

export const convertUnit = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  if (fromUnit === 'mg/dL' && toUnit === 'mmol/L') return (value / 18).toFixed(1);
  if (fromUnit === 'mmol/L' && toUnit === 'mg/dL') return Math.round(value * 18);
  return value;
};

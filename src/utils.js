
export const formatCurrency = (amount) => {
    if (isNaN(amount)) return '$0.00';
    return `$${amount.toFixed(2)}`;
  };
  
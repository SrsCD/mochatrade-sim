export function formatCurrency(value: number): string {
  // We need to format based on size.
  // 1 Crore = 10,000,000
  // 1 Lakh = 100,000
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)} L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString('en-IN');
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

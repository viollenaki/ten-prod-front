// Helper to format amounts in Dollars ($)
export function formatSom(amount) {
  const n = Number(amount) || 0;
  return '$' + Math.round(n);
}

export default formatSom;

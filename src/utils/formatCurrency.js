// Small helper to format amounts in Kyrgyz som (KGS) without fractions
export function formatSom(amount) {
  const n = Number(amount) || 0;
  // Format using space as thousand separator per example (ru-RU uses non-breaking space)
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' сом';
}

export default formatSom;

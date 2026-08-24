export function formatPrice(price) {
  if (typeof price === 'string') return price;
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(price);
}

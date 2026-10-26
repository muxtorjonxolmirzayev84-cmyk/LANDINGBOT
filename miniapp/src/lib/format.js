export function formatPrice(value) {
  const n = Math.round(Number(value) || 0);
  return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`;
}

export function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function discountPercent(product) {
  if (!product?.oldPrice || product.oldPrice <= product.newPrice) return 0;
  return Math.round((1 - product.newPrice / product.oldPrice) * 100);
}

export const FALLBACK_IMAGE = '/images/pizza-default.svg';

export function onImageError(e) {
  if (!e.currentTarget.src.endsWith(FALLBACK_IMAGE)) e.currentTarget.src = FALLBACK_IMAGE;
}

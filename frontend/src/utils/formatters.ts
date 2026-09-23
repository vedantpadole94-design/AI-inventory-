export const numberFormat = new Intl.NumberFormat('en-US');

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

export const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const toCSV = (rows: Record<string, string | number>[]) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const values = rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(','));
  return [headers.join(','), ...values].join('\n');
};

export default function formatCurrency(val, n = 0, x = 3, s = ',', c = '.') {
  const re = `\\d(?=(\\d{${(x || 3)}})+${(n > 0 ? '\\D' : '$')})`;
  const num = val.toFixed(Math.max(0, Number(n)));
  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), `$&${(s || ',')}`);
}

const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

export default function formatMoney(rupees: number): string {
  // const dollars = rupees / 100;
  return formatter.format(rupees);
}

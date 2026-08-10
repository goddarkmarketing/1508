export function formatDuration(days: number, nights: number) {
  return `${days}D${nights}N`;
}

export function formatCurrencyThb(amount: number) {
  return new Intl.NumberFormat("en-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cnJoin(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

import { useEffect, useState } from "react";

export const EXPENSE_CATS = {
  Food: "#e76f51", Transport: "#f4a261", Housing: "#2a9d8f", Bills: "#457b9d",
  Health: "#9b5de5", Shopping: "#e56b9b", Entertainment: "#e9c46a",
  Education: "#5e60ce", Other: "#8d99ae",
};
export const INCOME_CATS = {
  Salary: "#2a9d8f", Freelance: "#57cc99", Investments: "#38a3a5",
  Gift: "#80ed99", Other: "#8d99ae",
};
export const ALL_CATS = [...new Set([...Object.keys(EXPENSE_CATS), ...Object.keys(INCOME_CATS)])];
export const CURRENCIES = ["USD", "EUR", "GBP", "KES", "NGN", "INR", "JPY", "CAD", "AUD"];

export const catColor = (type, c) =>
  (type === "income" ? INCOME_CATS : EXPENSE_CATS)[c] || "#8d99ae";

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  }, [key, value]);
  return [value, setValue];
}

export const money = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);

export const today = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
export const monthKey = (dateStr) => dateStr.slice(0, 7);
export const monthLabel = (key, short = false) =>
  new Date(key + "-01T00:00:00").toLocaleDateString(undefined, {
    month: short ? "short" : "long",
    year: short ? undefined : "numeric",
  });
export const fmtDate = (s) =>
  new Date(s + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export const uid = () =>
  (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));

export function lastMonths(endKey, count = 6) {
  const [y, m] = endKey.split("-").map(Number);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(y, m - 1 - (count - 1 - i), 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
}

export function exportCsv(rows) {
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [["Date", "Type", "Category", "Description", "Amount"].join(",")].concat(
    rows.map((r) => [r.date, r.type, r.category, esc(r.description), r.amount].join(","))
  );
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `expenses-${today()}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

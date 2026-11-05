import { useEffect, useMemo, useState } from "react";
import Summary from "./components/Summary";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Settings from "./components/Settings";
import { CategoryBreakdown, Trend } from "./components/Charts";
import { ALL_CATS, exportCsv, monthKey, monthLabel, today, uid, useLocalStorage } from "./utils";

export default function App() {
  const [tx, setTx] = useLocalStorage("pocketbook:tx", []);
  const [settings, setSettings] = useLocalStorage("pocketbook:settings", { currency: "USD", budget: 0, theme: "auto" });
  const [filters, setFilters] = useState({ month: monthKey(today()), type: "all", category: "all", q: "" });
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  const months = useMemo(() => {
    const set = new Set(tx.map((t) => monthKey(t.date)));
    set.add(monthKey(today()));
    return [...set].sort().reverse();
  }, [tx]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return tx
      .filter((t) => filters.month === "all" || t.date.startsWith(filters.month))
      .filter((t) => filters.type === "all" || t.type === filters.type)
      .filter((t) => filters.category === "all" || t.category === filters.category)
      .filter((t) => !q || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  }, [tx, filters]);

  const income = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const setF = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  const save = (data) => {
    if (editing) setTx((list) => list.map((t) => (t.id === editing.id ? { ...t, ...data } : t)));
    else setTx((list) => [{ ...data, id: uid() }, ...list]);
    setEditing(null);
    setFormOpen(false);
  };
  const remove = (t) => {
    if (window.confirm(`Delete "${t.description}"?`)) {
      setTx((list) => list.filter((x) => x.id !== t.id));
      if (editing?.id === t.id) setEditing(null);
    }
  };
  const edit = (t) => {
    setEditing(t);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const clearAll = () => {
    if (window.confirm("Delete all transactions? This cannot be undone.")) setTx([]);
  };
  const cycleTheme = () =>
    setSettings((s) => ({ ...s, theme: s.theme === "auto" ? "dark" : s.theme === "dark" ? "light" : "auto" }));
  const themeIcon = { auto: "◐", dark: "☾", light: "☀" }[settings.theme];
  const chartEnd = filters.month === "all" ? monthKey(today()) : filters.month;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo" aria-hidden="true">₱</span>
          <div>
            <h1>Pocketbook</h1>
            <p className="muted">Know where your money goes</p>
          </div>
        </div>
        <div className="top-actions">
          <button className="icon" onClick={cycleTheme} aria-label={`Theme: ${settings.theme}. Click to change`} title={`Theme: ${settings.theme}`}>{themeIcon}</button>
          <button className="btn primary add-btn" onClick={() => { setEditing(null); setFormOpen((o) => !o); }}>
            {formOpen && !editing ? "Close" : "+ Add"}
          </button>
        </div>
      </header>

      <main className="layout">
        <aside className="side">
          <div className={"card composer" + (formOpen || editing ? " open" : "")}>
            <TransactionForm key={editing ? editing.id : "new"} initial={editing} onSave={save} onCancel={() => { setEditing(null); setFormOpen(false); }} />
          </div>
          <Settings settings={settings} setSettings={setSettings} count={tx.length} onExport={() => exportCsv(tx)} onClear={clearAll} />
        </aside>

        <div className="content">
          <Summary income={income} expense={expense} budget={settings.budget} showBudget={filters.month !== "all"} currency={settings.currency} />

          <div className="charts">
            <CategoryBreakdown items={filtered} currency={settings.currency} />
            <Trend all={tx} endKey={chartEnd} currency={settings.currency} />
          </div>

          <section className="card">
            <div className="list-head">
              <h2>Transactions <small>{filtered.length}</small></h2>
            </div>
            <div className="filters">
              <input type="search" placeholder="Search…" aria-label="Search transactions" value={filters.q} onChange={(e) => setF("q", e.target.value)} />
              <select aria-label="Month" value={filters.month} onChange={(e) => setF("month", e.target.value)}>
                <option value="all">All time</option>
                {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
              </select>
              <select aria-label="Type" value={filters.type} onChange={(e) => setF("type", e.target.value)}>
                <option value="all">All types</option>
                <option value="expense">Expenses</option>
                <option value="income">Income</option>
              </select>
              <select aria-label="Category" value={filters.category} onChange={(e) => setF("category", e.target.value)}>
                <option value="all">All categories</option>
                {ALL_CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <TransactionList items={filtered} currency={settings.currency} onEdit={edit} onDelete={remove} />
          </section>
        </div>
      </main>
    </div>
  );
}

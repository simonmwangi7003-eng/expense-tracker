import { useState } from "react";
import { EXPENSE_CATS, INCOME_CATS, today } from "../utils";

export default function TransactionForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(
    initial
      ? { ...initial, amount: String(initial.amount) }
      : { type: "expense", amount: "", description: "", category: "Food", date: today() }
  );
  const [errors, setErrors] = useState({});
  const cats = Object.keys(f.type === "income" ? INCOME_CATS : EXPENSE_CATS);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const setType = (type) =>
    setF((p) => ({ ...p, type, category: Object.keys(type === "income" ? INCOME_CATS : EXPENSE_CATS)[0] }));

  const submit = (e) => {
    e.preventDefault();
    const amount = parseFloat(f.amount);
    const errs = {};
    if (!f.description.trim()) errs.description = "Add a short description.";
    if (!(amount > 0)) errs.amount = "Enter an amount greater than 0.";
    if (!f.date) errs.date = "Pick a date.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({ ...f, amount: Math.round(amount * 100) / 100, description: f.description.trim() });
    if (!initial) setF({ ...f, amount: "", description: "" });
  };

  return (
    <form onSubmit={submit} noValidate className="form">
      <h2>{initial ? "Edit transaction" : "Add transaction"}</h2>
      <div className="seg" role="group" aria-label="Transaction type">
        {["expense", "income"].map((t) => (
          <button type="button" key={t} className={f.type === t ? "on " + t : ""} aria-pressed={f.type === t} onClick={() => setType(t)}>
            {t === "expense" ? "Expense" : "Income"}
          </button>
        ))}
      </div>
      <label>
        Amount
        <input type="number" inputMode="decimal" step="0.01" min="0" placeholder="0.00" value={f.amount} onChange={(e) => set("amount", e.target.value)} aria-invalid={!!errors.amount} />
        {errors.amount && <span className="err">{errors.amount}</span>}
      </label>
      <label>
        Description
        <input type="text" maxLength="60" placeholder="e.g. Groceries" value={f.description} onChange={(e) => set("description", e.target.value)} aria-invalid={!!errors.description} />
        {errors.description && <span className="err">{errors.description}</span>}
      </label>
      <div className="row2">
        <label>
          Category
          <select value={f.category} onChange={(e) => set("category", e.target.value)}>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} aria-invalid={!!errors.date} />
          {errors.date && <span className="err">{errors.date}</span>}
        </label>
      </div>
      <div className="actions">
        <button className="btn primary" type="submit">{initial ? "Save changes" : "Add transaction"}</button>
        {(initial || onCancel) && <button className="btn" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

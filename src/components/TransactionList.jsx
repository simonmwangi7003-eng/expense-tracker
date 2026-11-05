import { catColor, fmtDate, money } from "../utils";

export default function TransactionList({ items, currency, onEdit, onDelete }) {
  if (items.length === 0)
    return (
      <div className="empty">
        <p><strong>No transactions found</strong></p>
        <p className="muted">Add your first transaction or adjust the filters above.</p>
      </div>
    );
  return (
    <ul className="tx-list">
      {items.map((t) => (
        <li key={t.id} className="tx">
          <i className="dot lg" style={{ background: catColor(t.type, t.category) }} aria-hidden="true" />
          <div className="tx-main">
            <span className="tx-desc">{t.description}</span>
            <span className="tx-meta">{t.category} · {fmtDate(t.date)}</span>
          </div>
          <span className={"tx-amt " + (t.type === "income" ? "pos" : "neg")}>
            {t.type === "income" ? "+" : "−"}{money(t.amount, currency)}
          </span>
          <div className="tx-actions">
            <button className="icon" onClick={() => onEdit(t)} aria-label={`Edit ${t.description}`} title="Edit">✎</button>
            <button className="icon danger" onClick={() => onDelete(t)} aria-label={`Delete ${t.description}`} title="Delete">✕</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

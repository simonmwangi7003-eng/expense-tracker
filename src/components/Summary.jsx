import { money } from "../utils";

export default function Summary({ income, expense, budget, showBudget, currency }) {
  const balance = income - expense;
  const pct = budget > 0 ? Math.min(100, (expense / budget) * 100) : 0;
  const over = budget > 0 && expense > budget;
  return (
    <section className="summary" aria-label="Summary">
      <div className="stat stat-balance">
        <span className="stat-label">Balance</span>
        <strong className={balance < 0 ? "neg" : ""}>{money(balance, currency)}</strong>
      </div>
      <div className="stat">
        <span className="stat-label">Income</span>
        <strong className="pos">{money(income, currency)}</strong>
      </div>
      <div className="stat">
        <span className="stat-label">Expenses</span>
        <strong className="neg">{money(expense, currency)}</strong>
      </div>
      {showBudget && budget > 0 && (
        <div className="budget">
          <div className="budget-head">
            <span>Monthly budget</span>
            <span className={over ? "neg" : ""}>
              {money(expense, currency)} of {money(budget, currency)}
              {over ? ` (${money(expense - budget, currency)} over)` : ""}
            </span>
          </div>
          <div className="bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin="0" aria-valuemax="100">
            <div className={"bar-fill" + (over ? " over" : pct > 80 ? " warn" : "")} style={{ width: pct + "%" }} />
          </div>
        </div>
      )}
    </section>
  );
}

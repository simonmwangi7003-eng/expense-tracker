import { catColor, lastMonths, money, monthLabel } from "../utils";

export function CategoryBreakdown({ items, currency }) {
  const expenses = items.filter((t) => t.type === "expense");
  const totals = {};
  expenses.forEach((t) => (totals[t.category] = (totals[t.category] || 0) + t.amount));
  const rows = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const sum = rows.reduce((s, [, v]) => s + v, 0);
  return (
    <section className="card">
      <h2>Where it went</h2>
      {rows.length === 0 ? (
        <p className="muted">No expenses in this view yet.</p>
      ) : (
        <ul className="breakdown">
          {rows.map(([cat, val]) => (
            <li key={cat}>
              <div className="breakdown-head">
                <span><i className="dot" style={{ background: catColor("expense", cat) }} />{cat}</span>
                <span>{money(val, currency)} <small>{Math.round((val / sum) * 100)}%</small></span>
              </div>
              <div className="bar thin">
                <div className="bar-fill" style={{ width: (val / rows[0][1]) * 100 + "%", background: catColor("expense", cat) }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Trend({ all, endKey, currency }) {
  const months = lastMonths(endKey, 6);
  const data = months.map((m) => {
    let income = 0, expense = 0;
    all.forEach((t) => {
      if (t.date.startsWith(m)) t.type === "income" ? (income += t.amount) : (expense += t.amount);
    });
    return { m, income, expense };
  });
  const max = Math.max(1, ...data.flatMap((d) => [d.income, d.expense]));
  const H = 140, bw = 14, gap = 8, group = bw * 2 + gap, pad = 18;
  const W = months.length * (group + 28) + pad;
  return (
    <section className="card">
      <h2>Last 6 months</h2>
      <div className="legend">
        <span><i className="dot income" />Income</span>
        <span><i className="dot expense" />Expenses</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="trend" role="img" aria-label="Income and expenses over the last six months">
        <line x1="0" x2={W} y1={H} y2={H} className="axis" />
        {data.map((d, i) => {
          const x = pad / 2 + i * (group + 28) + 14;
          const hi = (d.income / max) * (H - 8), he = (d.expense / max) * (H - 8);
          return (
            <g key={d.m}>
              <rect x={x} y={H - hi} width={bw} height={hi} rx="3" className="bar-income">
                <title>{`${monthLabel(d.m)} income: ${money(d.income, currency)}`}</title>
              </rect>
              <rect x={x + bw + gap / 2} y={H - he} width={bw} height={he} rx="3" className="bar-expense">
                <title>{`${monthLabel(d.m)} expenses: ${money(d.expense, currency)}`}</title>
              </rect>
              <text x={x + group / 2 - 1} y={H + 16} textAnchor="middle" className="axis-label">
                {monthLabel(d.m, true)}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

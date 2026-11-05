import { CURRENCIES } from "../utils";

export default function Settings({ settings, setSettings, onExport, onClear, count }) {
  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));
  return (
    <section className="card">
      <h2>Settings</h2>
      <div className="row2">
        <label>
          Currency
          <select value={settings.currency} onChange={(e) => set("currency", e.target.value)}>
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>
          Monthly budget
          <input type="number" min="0" inputMode="decimal" placeholder="0 = off" value={settings.budget || ""} onChange={(e) => set("budget", Math.max(0, parseFloat(e.target.value) || 0))} />
        </label>
      </div>
      <div className="actions wrap">
        <button className="btn" onClick={onExport} disabled={!count}>Export CSV</button>
        <button className="btn danger-btn" onClick={onClear} disabled={!count}>Clear all data</button>
      </div>
    </section>
  );
}

const STATS = [
  { value: "€18.40", label: "Caught per month" },
  { value: "50/50", label: "Default grow / give split" },
  { value: "€0.10", label: "Smallest valid deposit" },
  { value: "0", label: "Decisions required" },
];

export default function Stats() {
  return (
    <div className="stats">
      <div className="stats__row">
        {STATS.map((s) => (
          <div key={s.label}>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

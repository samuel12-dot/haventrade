export default function StatusPill({ children }) {
  return (
    <span className="status-pill">
      <span className="dot" />
      {children}
    </span>
  );
}

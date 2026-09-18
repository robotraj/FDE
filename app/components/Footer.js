export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__logo">FractionFlow</div>
      <div>Spend €1.10 · invest €0.90 · decide nothing.</div>
      <div style={{ marginTop: 10 }}>© {new Date().getFullYear()} FractionFlow. A concept prototype.</div>
    </footer>
  );
}

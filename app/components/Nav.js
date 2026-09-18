export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav__row container">
        <div className="nav__logo">
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#5FA23F,#1F3D2B)",
              display: "inline-block",
            }}
          />
          FractionFlow
        </div>
        <div className="nav__links">
          <a href="#how-it-works" className="nav__hide-mobile">
            How it works
          </a>
          <a href="#demo" className="nav__hide-mobile">
            Try it live
          </a>
          <a href="#impact" className="nav__hide-mobile">
            Impact
          </a>
          <a href="#demo" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>
            Get started
          </a>
        </div>
      </div>
    </nav>
  );
}

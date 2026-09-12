"use client";

import { useEffect, useRef, useState } from "react";

const MERCHANTS = [
  ["Café Marlow", 1.1],
  ["Metro day pass", 3.8],
  ["Corner grocer", 11.45],
  ["Pharmacy", 7.9],
  ["Bookshop", 14.5],
  ["Bakery", 2.35],
  ["Laundry", 6.25],
  ["Bike repair", 18.7],
  ["Noodle bar", 9.6],
  ["Data top-up", 12.99],
];

const CAUSES = [
  { id: "water", name: "Clean Water Collective", note: "2 wells · 340 givers", hue: 225 },
  { id: "books", name: "Books for Every Class", note: "€4 = one textbook", hue: 285 },
  { id: "meals", name: "Neighbourhood Kitchen", note: "€2.50 = one hot meal", hue: 35 },
];

const STEPS = [
  { n: "01", text: "Tap Spend something — a purchase happens and the leftover fraction is caught on screen." },
  { n: "02", text: "Change the round-up to €1, €2 or €5 and spend again. The maths updates instantly." },
  { n: "03", text: "Hit Put to work, then slide invest vs donate on the second screen." },
  { n: "04", text: "Repeat a few times and watch the curve and the impact build with no decisions." },
];

const PRINCIPLES = [
  { tag: "No discipline", text: "The habit is the system, not you. Nothing to remember or schedule." },
  { tag: "No minimum", text: "€0.10 is a valid deposit. Investing stops being for other people." },
  { tag: "Always reversible", text: "Weekly caps, low-balance pause, one-tap withdraw." },
  { tag: "Visible impact", text: "Every donation returns a receipt and a number." },
];

const TABS = [
  { key: "wallet", label: "Wallet" },
  { key: "grow", label: "Grow & Give" },
];

const BAR_HEIGHTS = [10, 14, 19, 26, 33, 42, 52, 64, 74, 88, 100, 116];
const BAR_LABELS = ["O", "N", "D", "J", "F", "M", "A", "M", "J", "J", "A", "S"];

const eur = (n) => "€" + n.toFixed(2);

function optStyle(active, extra) {
  return Object.assign(
    {
      flex: 1,
      textAlign: "center",
      padding: "11px 8px",
      borderRadius: "99px",
      cursor: "pointer",
      fontFamily: "'DM Mono', monospace",
      fontSize: "12px",
      transition: "all .18s ease",
      border: active ? "1px solid oklch(0.62 0.14 245)" : "1px solid oklch(0.9 0.03 235)",
      background: active ? "oklch(0.62 0.14 245)" : "oklch(0.99 0.008 235)",
      color: active ? "oklch(0.99 0.01 235)" : "oklch(0.48 0.05 245)",
      boxShadow: active ? "0 6px 16px -10px oklch(0.5 0.12 245)" : "none",
    },
    extra
  );
}

export default function Home() {
  const [tab, setTab] = useState("wallet");
  const [balance, setBalance] = useState(0);
  const [feed, setFeed] = useState([]);
  const [captured, setCaptured] = useState(0);
  const [count, setCount] = useState(0);
  const [roundTo, setRoundTo] = useState(2);
  const [investPct, setInvestPct] = useState(50);
  const [invested, setInvested] = useState(0);
  const [donated, setDonated] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [cause, setCause] = useState("water");
  const [phase, setPhase] = useState(null);
  const [tx, setTx] = useState(null);
  const [toast, setToast] = useState(null);

  const timersRef = useRef([]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
  };

  const flash = (msg) => {
    setToast(msg);
    later(() => setToast((t) => (t === msg ? null : t)), 2800);
  };

  const spend = () => {
    if (phase) return;
    const [merchant, amount] = MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
    const step = roundTo;
    const rounded = Math.ceil((amount + 0.001) / step) * step;
    const capturedAmt = Math.round((rounded - amount) * 100) / 100;
    const nextTx = { merchant, amount, rounded, captured: capturedAmt };

    setTab("wallet");
    setPhase("spend");
    setTx(nextTx);
    setToast(null);

    later(() => setPhase("round"), 700);
    later(() => {
      setPhase("sweep");
      setBalance((b) => Math.round((b + capturedAmt) * 100) / 100);
      setCaptured((c) => Math.round((c + capturedAmt) * 100) / 100);
      setCount((c) => c + 1);
      setFeed((f) => [nextTx, ...f].slice(0, 10));
    }, 1700);
    later(() => {
      setPhase(null);
      setTx(null);
    }, 3000);
  };

  const putToWork = () => {
    if (balance <= 0) {
      flash("Nothing to move yet — spend something first.");
      return;
    }
    const inv = Math.round(balance * investPct) / 100;
    const don = Math.round((balance - inv) * 100) / 100;
    setBalance(0);
    setTab("grow");
    setRounds((r) => r + 1);
    setInvested((v) => Math.round((v + inv) * 100) / 100);
    setDonated((v) => Math.round((v + don) * 100) / 100);
    flash(
      inv > 0 && don > 0
        ? "Invested " + eur(inv) + " · donated " + eur(don)
        : inv > 0
        ? "Invested " + eur(inv) + " in your index fund"
        : "Donated " + eur(don) + " — receipt saved"
    );
  };

  const resetDemo = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setTab("wallet");
    setBalance(0);
    setFeed([]);
    setCaptured(0);
    setCount(0);
    setInvested(0);
    setDonated(0);
    setRounds(0);
    setPhase(null);
    setTx(null);
    setToast(null);
  };

  // ---- derived render values ----
  const coffee = Math.ceil((1.1 + 0.001) / roundTo) * roundTo;
  const boost = Math.min(rounds * 6, 40);
  const onWallet = tab === "wallet";
  const onGrow = tab === "grow";
  const donatePct = 100 - investPct;
  const feedEmpty = feed.length === 0;
  const capturing = !!phase;
  const showRounded = phase === "round" || phase === "sweep";
  const showSwept = phase === "sweep";
  const activeCause = CAUSES.find((c) => c.id === cause) || CAUSES[0];
  const agentLine =
    donated > 0
      ? "Sent " + eur(donated) + " to " + activeCause.name + ". Receipt saved to your inbox."
      : "I'll sweep at midnight, invest weekly, and pause automatically if your balance dips under €40.";
  const spendStyle = {
    position: "relative",
    zIndex: 0,
    padding: "18px 42px",
    borderRadius: "99px",
    border: "none",
    cursor: phase ? "default" : "pointer",
    fontSize: "16px",
    fontWeight: 500,
    background: phase ? "oklch(0.72 0.07 245)" : "oklch(0.32 0.06 250)",
    color: "oklch(0.99 0.01 235)",
    boxShadow: "0 16px 30px -18px oklch(0.4 0.08 250/.9)",
  };
  const ctaStyle = {
    width: "100%",
    padding: "17px",
    borderRadius: "99px",
    cursor: "pointer",
    border: "none",
    fontSize: "15px",
    fontWeight: 500,
    transition: "all .2s ease",
    background:
      balance > 0
        ? "linear-gradient(120deg, oklch(0.62 0.14 245), oklch(0.55 0.14 262))"
        : "oklch(0.92 0.02 235)",
    color: balance > 0 ? "oklch(0.99 0.01 235)" : "oklch(0.62 0.03 245)",
    boxShadow: balance > 0 ? "0 14px 26px -16px oklch(0.5 0.13 250)" : "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 32px 56px",
        display: "flex",
        gap: 46,
        alignItems: "flex-start",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {/* ---------------- Left column ---------------- */}
      <div
        style={{
          flex: "1 1 330px",
          maxWidth: 412,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          paddingTop: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "oklch(0.62 0.14 245)",
            }}
          />
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "oklch(0.45 0.06 245)",
            }}
          >
            FractionFlow
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontWeight: 400,
            fontSize: 46,
            lineHeight: 1.03,
            color: "oklch(0.3 0.07 250)",
            textWrap: "balance",
          }}
        >
          Every purchase leaves change.
          <br />
          <em style={{ color: "oklch(0.55 0.14 245)", fontStyle: "italic" }}>We put it to work.</em>
        </h1>
        <p
          style={{
            margin: 0,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "oklch(0.55 0.11 245)",
          }}
        >
          Spend €1.10 · invest €0.90 · decide nothing
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 16,
            lineHeight: 1.55,
            color: "oklch(0.46 0.04 245)",
            textWrap: "pretty",
          }}
        >
          Two screens, fully live. Tap{" "}
          <strong style={{ fontWeight: 500, color: "oklch(0.34 0.07 250)" }}>Spend something</strong> and
          watch a real fraction get caught, swept and put to work.
        </p>

        <div
          style={{
            position: "relative",
            height: 200,
            borderRadius: 26,
            overflow: "hidden",
            background:
              "radial-gradient(120% 130% at 12% 8%, oklch(0.72 0.12 225) 0%, oklch(0.55 0.14 248) 46%, oklch(0.36 0.1 258) 100%)",
            boxShadow: "0 22px 44px -26px oklch(0.4 0.08 245/.6)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -30,
              bottom: -56,
              width: 190,
              height: 190,
              borderRadius: "50%",
              border: "1px solid oklch(0.99 0.01 235/.34)",
              animation: "ffDrift 11s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 18,
              bottom: -24,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "oklch(0.99 0.01 235/.14)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 26,
              top: 24,
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "oklch(0.92 0.13 150/.85)",
              animation: "ffFloat 4.6s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 98,
              top: 86,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "oklch(0.99 0.01 235/.45)",
              animation: "ffFloat 3.6s ease-in-out .6s infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "auto 22px 20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              color: "oklch(0.99 0.01 235)",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                opacity: 0.8,
              }}
            >
              This month
            </span>
            <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 34, lineHeight: 1 }}>
              €18.40 caught
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: 20,
            borderRadius: 24,
            background: "oklch(0.99 0.008 235)",
            border: "1px solid oklch(0.9 0.03 235)",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "oklch(0.55 0.14 245)",
            }}
          >
            Try, in this order
          </span>
          {STEPS.map((s) => (
            <div key={s.n} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "oklch(0.6 0.14 245)",
                  paddingTop: 3,
                }}
              >
                {s.n}
              </span>
              <span style={{ fontSize: 14, lineHeight: 1.5, color: "oklch(0.43 0.04 245)", textWrap: "pretty" }}>
                {s.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 26, alignItems: "flex-end", fontFamily: "'DM Mono', monospace" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "oklch(0.55 0.04 245)",
              }}
            >
              Caught here
            </span>
            <span style={{ fontSize: 22, color: "oklch(0.3 0.07 250)" }}>{eur(captured)}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "oklch(0.55 0.04 245)",
              }}
            >
              Purchases
            </span>
            <span style={{ fontSize: 22, color: "oklch(0.3 0.07 250)" }}>{count}</span>
          </div>
          <button
            onClick={resetDemo}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(0.55 0.04 245)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Reset demo
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px 22px",
            borderTop: "1px solid oklch(0.88 0.03 235)",
            paddingTop: 20,
          }}
        >
          {PRINCIPLES.map((p) => (
            <div key={p.tag} style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "oklch(0.55 0.14 245)",
                }}
              >
                {p.tag}
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.5, color: "oklch(0.45 0.04 245)", textWrap: "pretty" }}>
                {p.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- Phone mockup column ---------------- */}
      <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        <div
          style={{
            width: 404,
            height: 844,
            maxWidth: "100%",
            borderRadius: 46,
            background: "oklch(0.32 0.06 250)",
            padding: 11,
            boxShadow: "0 44px 80px -34px oklch(0.4 0.08 245/.6)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 36,
              overflow: "hidden",
              background: "oklch(0.98 0.012 235)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                flex: "none",
                display: "flex",
                justifyContent: "space-between",
                padding: "16px 26px 0",
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                color: "oklch(0.5 0.04 245)",
              }}
            >
              <span>9:41</span>
              <span>5G  100%</span>
            </div>

            {onWallet && (
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  padding: "16px 22px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "oklch(0.55 0.04 245)",
                    }}
                  >
                    FractionFlow wallet
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "oklch(0.58 0.14 245)" }}>
                    {count} swept
                  </span>
                </div>

                <div
                  style={{
                    borderRadius: 28,
                    padding: 22,
                    background: "linear-gradient(150deg, oklch(0.66 0.13 238) 0%, oklch(0.5 0.13 258) 100%)",
                    color: "oklch(0.99 0.01 235)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 13,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      opacity: 0.78,
                    }}
                  >
                    Ready to put to work
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3, fontFamily: "'Instrument Serif', Georgia, serif" }}>
                    <span style={{ fontSize: 30 }}>€</span>
                    <span style={{ fontSize: 62, lineHeight: 1 }}>{balance.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: "'DM Mono', monospace", fontSize: 11, opacity: 0.92 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "oklch(0.92 0.13 150)" }} />
                    <span>
                      {balance > 0
                        ? "From " + count + " purchases · not yet invested"
                        : "Spend something to catch your first fraction"}
                    </span>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      right: -44,
                      top: -44,
                      width: 152,
                      height: 152,
                      borderRadius: "50%",
                      background: "oklch(0.99 0.01 235/.13)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: 34,
                      bottom: -30,
                      width: 74,
                      height: 74,
                      borderRadius: "50%",
                      border: "1px solid oklch(0.99 0.01 235/.3)",
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: 18,
                    borderRadius: 24,
                    background: "oklch(0.995 0.006 235)",
                    border: "1px solid oklch(0.9 0.03 235)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 13,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "oklch(0.32 0.06 250)" }}>
                      Round up to the next
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "oklch(0.6 0.14 245)",
                      }}
                    >
                      live
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[1, 2, 5].map((v) => (
                      <button key={v} onClick={() => setRoundTo(v)} style={optStyle(roundTo === v)}>
                        €{v}
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: 13, lineHeight: 1.45, color: "oklch(0.48 0.04 245)", textWrap: "pretty" }}>
                    A €1.10 coffee becomes {eur(coffee)} — the extra {eur(coffee - 1.1)} goes to work.
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "oklch(0.55 0.04 245)",
                    }}
                  >
                    Fractions caught
                  </span>
                  {feedEmpty && (
                    <div
                      style={{
                        padding: "24px 18px",
                        borderRadius: 22,
                        border: "1px dashed oklch(0.85 0.04 235)",
                        textAlign: "center",
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: "oklch(0.55 0.04 245)",
                        textWrap: "pretty",
                      }}
                    >
                      Empty for now. Every purchase you make below lands here automatically.
                    </div>
                  )}
                  {feed.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        padding: "11px 2px",
                        borderBottom: "1px solid oklch(0.93 0.02 235)",
                        animation: i === 0 ? "ffIn .34s ease both" : "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                        <span
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 11,
                            flex: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 13,
                            color: "oklch(0.99 0.01 235)",
                            background:
                              "linear-gradient(140deg, oklch(0.7 0.12 " +
                              ((200 + (i * 17)) % 90) +
                              "), oklch(0.56 0.13 " +
                              ((240 + (i * 13)) % 40) +
                              "))",
                          }}
                        >
                          {f.merchant[0]}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                          <span style={{ fontSize: 15, color: "oklch(0.32 0.06 250)" }}>{f.merchant}</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "oklch(0.58 0.04 245)" }}>
                            {eur(f.amount)} → {eur(f.rounded)}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: "oklch(0.55 0.14 245)" }}>
                        +{eur(f.captured)}
                      </span>
                    </div>
                  ))}
                </div>

                <button onClick={putToWork} style={ctaStyle}>
                  {balance > 0 ? "Put " + eur(balance) + " to work" : "Nothing to move yet"}
                </button>
              </div>
            )}

            {onGrow && (
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  padding: "16px 22px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 15,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontWeight: 400,
                    fontSize: 30,
                    lineHeight: 1.1,
                    color: "oklch(0.3 0.07 250)",
                  }}
                >
                  Grow some, give some
                </h2>

                <div
                  style={{
                    padding: 18,
                    borderRadius: 24,
                    background: "oklch(0.995 0.006 235)",
                    border: "1px solid oklch(0.9 0.03 235)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 11,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                    <span style={{ color: "oklch(0.52 0.13 245)" }}>Invest {investPct}%</span>
                    <span style={{ color: "oklch(0.52 0.13 35)" }}>Donate {donatePct}%</span>
                  </div>
                  <div style={{ height: 12, borderRadius: 99, overflow: "hidden", display: "flex", background: "oklch(0.91 0.03 235)" }}>
                    <div
                      style={{
                        background: "oklch(0.62 0.14 245)",
                        transition: "width .35s cubic-bezier(.3,.8,.3,1)",
                        width: investPct + "%",
                      }}
                    />
                    <div
                      style={{
                        background: "oklch(0.66 0.14 35)",
                        transition: "width .35s cubic-bezier(.3,.8,.3,1)",
                        width: donatePct + "%",
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={investPct}
                    onChange={(e) => setInvestPct(Number(e.target.value))}
                  />
                  <div style={{ display: "flex", gap: 7 }}>
                    {[100, 75, 50, 25, 0].map((v) => (
                      <button
                        key={v}
                        onClick={() => setInvestPct(v)}
                        style={optStyle(investPct === v, { padding: "9px 4px", fontSize: 11 })}
                      >
                        {v === 100 ? "All grow" : v === 0 ? "All give" : v + "/" + (100 - v)}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <div
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 22,
                      background: "oklch(0.995 0.006 235)",
                      border: "1px solid oklch(0.9 0.03 235)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "oklch(0.52 0.13 245)",
                      }}
                    >
                      Invested
                    </span>
                    <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, color: "oklch(0.3 0.07 250)" }}>
                      {eur(invested)}
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 22,
                      background: "oklch(0.995 0.006 235)",
                      border: "1px solid oklch(0.9 0.03 235)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "oklch(0.52 0.13 35)",
                      }}
                    >
                      Donated
                    </span>
                    <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, color: "oklch(0.36 0.09 35)" }}>
                      {eur(donated)}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "18px 18px 14px",
                    borderRadius: 24,
                    background: "oklch(0.995 0.006 235)",
                    border: "1px solid oklch(0.9 0.03 235)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 13,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "oklch(0.32 0.06 250)" }}>Your curve</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "oklch(0.58 0.04 245)" }}>
                      {rounds > 0 ? rounds + " deposits made" : "projection"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 106 }}>
                    {BAR_HEIGHTS.map((h, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                        <div
                          style={{
                            width: "100%",
                            borderRadius: "7px 7px 3px 3px",
                            height: Math.min(h + (i > 7 ? boost : 0), 100) + "%",
                            transition: "height .5s cubic-bezier(.3,.8,.3,1)",
                            background:
                              i === BAR_HEIGHTS.length - 1
                                ? "linear-gradient(180deg, oklch(0.66 0.13 238), oklch(0.54 0.13 252))"
                                : "oklch(0.85 0.06 238)",
                          }}
                        />
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "oklch(0.62 0.04 245)" }}>
                          {BAR_LABELS[i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "oklch(0.55 0.04 245)",
                    }}
                  >
                    Where your giving goes
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {CAUSES.map((c) => {
                      const active = cause === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setCause(c.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 13,
                            padding: 12,
                            borderRadius: 22,
                            cursor: "pointer",
                            transition: "all .18s ease",
                            width: "100%",
                            border: active ? "1px solid oklch(0.62 0.14 245)" : "1px solid oklch(0.9 0.03 235)",
                            background: active ? "oklch(0.95 0.035 238)" : "oklch(0.995 0.006 235)",
                            color: active ? "oklch(0.33 0.08 250)" : "oklch(0.4 0.04 245)",
                          }}
                        >
                          <span
                            style={{
                              width: 54,
                              height: 54,
                              borderRadius: 16,
                              flex: "none",
                              background:
                                "radial-gradient(120% 120% at 20% 15%, oklch(0.82 0.1 " +
                                c.hue +
                                ") 0%, oklch(0.62 0.13 " +
                                (c.hue + 12) +
                                ") 55%, oklch(0.45 0.12 " +
                                (c.hue + 24) +
                                ") 100%)",
                              boxShadow: "inset 0 -10px 18px -12px oklch(0.3 0.08 250/.8)",
                            }}
                          />
                          <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0, textAlign: "left" }}>
                            <span style={{ fontSize: 15, fontWeight: 500 }}>{c.name}</span>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, opacity: 0.72 }}>{c.note}</span>
                          </div>
                          <span
                            style={{
                              marginLeft: "auto",
                              flex: "none",
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              border: active ? "6px solid oklch(0.62 0.14 245)" : "1px solid oklch(0.85 0.03 235)",
                              transition: "all .18s ease",
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    padding: 18,
                    borderRadius: 24,
                    background: "oklch(0.32 0.06 250)",
                    color: "oklch(0.98 0.012 235)",
                    display: "flex",
                    gap: 13,
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      flex: "none",
                      background: "oklch(0.66 0.13 238)",
                      animation: "ffFloat 3.6s ease-in-out infinite",
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "oklch(0.84 0.09 235)",
                      }}
                    >
                      Agent
                    </span>
                    <span style={{ fontSize: 14, lineHeight: 1.45, color: "oklch(0.98 0.012 235/.9)", textWrap: "pretty" }}>
                      {agentLine}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                flex: "none",
                display: "flex",
                padding: "10px 16px 16px",
                gap: 8,
                borderTop: "1px solid oklch(0.91 0.025 235)",
                background: "oklch(0.98 0.012 235)",
              }}
            >
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={optStyle(tab === t.key, {
                    padding: "13px 8px",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  })}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {capturing && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "oklch(0.28 0.06 252/.72)",
                  backdropFilter: "blur(3px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0,
                  color: "oklch(0.99 0.01 235)",
                  animation: "ffFade .2s ease both",
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    opacity: 0.75,
                  }}
                >
                  {tx ? "Just now · " + tx.merchant : ""}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 2,
                    marginTop: 18,
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    opacity: 0.58,
                  }}
                >
                  <span style={{ fontSize: 34 }}>€</span>
                  <span style={{ fontSize: 74, lineHeight: 1 }}>{tx ? tx.amount.toFixed(2) : ""}</span>
                </div>

                {showRounded && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 14,
                      marginTop: 22,
                      animation: "ffPop .34s cubic-bezier(.2,.9,.3,1) both",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 11,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "oklch(0.86 0.12 150)",
                      }}
                    >
                      Rounded to €{tx ? tx.rounded.toFixed(2) : ""}
                    </span>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "baseline",
                        gap: 2,
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        color: "oklch(0.9 0.12 150)",
                      }}
                    >
                      <span style={{ fontSize: 30 }}>+€</span>
                      <span style={{ fontSize: 70, lineHeight: 1 }}>{tx ? tx.captured.toFixed(2) : ""}</span>
                      <span
                        style={{
                          position: "absolute",
                          left: -52,
                          bottom: 4,
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: "oklch(0.9 0.12 150/.9)",
                          animation: "ffCoin 1.5s ease-out .1s both",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          left: -16,
                          bottom: -6,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "oklch(0.99 0.01 235/.6)",
                          animation: "ffCoin 1.7s ease-out .34s both",
                        }}
                      />
                    </div>
                  </div>
                )}

                {showSwept && (
                  <div
                    style={{
                      marginTop: 26,
                      padding: "13px 20px",
                      borderRadius: 99,
                      background: "oklch(0.99 0.01 235/.16)",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                      letterSpacing: "0.08em",
                      animation: "ffPop .3s ease both",
                    }}
                  >
                    Swept to your wallet →
                  </div>
                )}
              </div>
            )}

            {toast && (
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  right: 20,
                  bottom: 84,
                  padding: "15px 18px",
                  borderRadius: 20,
                  background: "oklch(0.32 0.06 250)",
                  color: "oklch(0.98 0.012 235)",
                  fontSize: 14,
                  lineHeight: 1.4,
                  display: "flex",
                  gap: 11,
                  alignItems: "center",
                  boxShadow: "0 18px 34px -20px oklch(0.3 0.06 250/.8)",
                  animation: "ffIn .3s ease both",
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: "50%", flex: "none", background: "oklch(0.9 0.12 150)" }} />
                <span style={{ minWidth: 0 }}>{toast}</span>
              </div>
            )}
          </div>
        </div>

        <button onClick={spend} style={spendStyle}>
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 99,
              background: "oklch(0.62 0.14 245)",
              animation: "ffRipple 2.6s ease-out infinite",
              zIndex: -1,
            }}
          />
          {phase ? "Capturing…" : "Spend something"}
        </button>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "oklch(0.52 0.05 245)" }}>
          {phase ? "Catching the fraction…" : "Uses a random merchant each tap"}
        </span>
      </div>
    </div>
  );
}

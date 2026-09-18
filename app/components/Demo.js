"use client";

import { useEffect, useRef, useState } from "react";
import Butterfly from "./Butterfly";

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
  { id: "water", name: "Clean Water Collective", note: "2 wells · 340 givers", hue: 195 },
  { id: "books", name: "Books for Every Class", note: "€4 = one textbook", hue: 132 },
  { id: "meals", name: "Neighbourhood Kitchen", note: "€2.50 = one hot meal", hue: 32 },
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

const C = {
  cream: "#FBF3E3",
  card: "#FFFDF7",
  cardSoft: "#FFFCF2",
  border: "#EAE0C6",
  ink: "#1F3D2B",
  body: "#544C3C",
  muted: "#8B8168",
  green: "#3F7C2A",
  greenBright: "#5FA23F",
  gold: "#D9A441",
  goldLight: "#F2C868",
  terracotta: "#D97A46",
  terracottaDeep: "#8A4C25",
};

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
      border: active ? `1px solid ${C.green}` : `1px solid ${C.border}`,
      background: active ? C.green : C.card,
      color: active ? C.cream : C.muted,
      boxShadow: active ? "0 6px 16px -10px rgba(63,124,42,.5)" : "none",
    },
    extra
  );
}

export default function Demo() {
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
    fontWeight: 600,
    background: phase ? "#BFCB9E" : C.ink,
    color: C.cream,
    boxShadow: "0 16px 30px -18px rgba(31,61,43,.6)",
  };
  const ctaStyle = {
    width: "100%",
    padding: "17px",
    borderRadius: "99px",
    cursor: "pointer",
    border: "none",
    fontSize: "15px",
    fontWeight: 600,
    transition: "all .2s ease",
    background: balance > 0 ? `linear-gradient(120deg, ${C.green}, ${C.greenBright})` : "#EDE4CC",
    color: balance > 0 ? C.cream : "#A99F84",
    boxShadow: balance > 0 ? "0 14px 26px -16px rgba(63,124,42,.55)" : "none",
  };

  return (
    <div
      style={{
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
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.green }} />
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.ink,
            }}
          >
            FractionFlow
          </span>
        </div>

        <h2
          style={{
            margin: 0,
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontWeight: 400,
            fontSize: 40,
            lineHeight: 1.05,
            color: C.ink,
            textWrap: "balance",
          }}
        >
          Every purchase leaves change.
          <br />
          <em style={{ color: C.green, fontStyle: "italic" }}>We put it to work.</em>
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.green,
          }}
        >
          Spend €1.10 · invest €0.90 · decide nothing
        </p>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: C.body, textWrap: "pretty" }}>
          Two screens, fully live. Tap <strong style={{ fontWeight: 600, color: C.ink }}>Spend something</strong>{" "}
          and watch a real fraction get caught, swept and put to work.
        </p>

        <div
          style={{
            position: "relative",
            height: 200,
            borderRadius: 26,
            overflow: "hidden",
            background: `radial-gradient(120% 130% at 12% 8%, ${C.goldLight} 0%, ${C.greenBright} 46%, ${C.ink} 100%)`,
            boxShadow: "0 22px 44px -26px rgba(31,61,43,.55)",
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
              border: "1px solid rgba(255,253,247,.34)",
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
              background: "rgba(255,253,247,.14)",
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
              background: "rgba(242,200,104,.85)",
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
              background: "rgba(255,253,247,.45)",
              animation: "ffFloat 3.6s ease-in-out .6s infinite",
            }}
          />
          <Butterfly variant="corner" style={{ right: 40, top: 10 }} />
          <div
            style={{
              position: "absolute",
              inset: "auto 22px 20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              color: C.cream,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                opacity: 0.85,
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
            background: C.card,
            border: `1px solid ${C.border}`,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: C.green,
            }}
          >
            Try, in this order
          </span>
          {STEPS.map((s) => (
            <div key={s.n} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.greenBright, paddingTop: 3 }}>
                {s.n}
              </span>
              <span style={{ fontSize: 14, lineHeight: 1.5, color: C.body, textWrap: "pretty" }}>{s.text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 26, alignItems: "flex-end", fontFamily: "'DM Mono', monospace" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted }}>
              Caught here
            </span>
            <span style={{ fontSize: 22, color: C.ink }}>{eur(captured)}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted }}>
              Purchases
            </span>
            <span style={{ fontSize: 22, color: C.ink }}>{count}</span>
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
              color: C.muted,
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
            borderTop: "1px solid #E3D6AE",
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
                  color: C.green,
                }}
              >
                {p.tag}
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.5, color: C.body, textWrap: "pretty" }}>{p.text}</span>
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
            background: C.ink,
            padding: 11,
            boxShadow: "0 44px 80px -34px rgba(31,61,43,.55)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 36,
              overflow: "hidden",
              background: "#FBF6E9",
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
                color: C.muted,
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
                      color: C.muted,
                    }}
                  >
                    FractionFlow wallet
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.green }}>
                    {count} swept
                  </span>
                </div>

                <div
                  style={{
                    borderRadius: 28,
                    padding: 22,
                    background: `linear-gradient(150deg, ${C.greenBright} 0%, #245E2A 100%)`,
                    color: C.cream,
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
                      opacity: 0.82,
                    }}
                  >
                    Ready to put to work
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 3,
                      fontFamily: "'Instrument Serif', Georgia, serif",
                    }}
                  >
                    <span style={{ fontSize: 30 }}>€</span>
                    <span style={{ fontSize: 62, lineHeight: 1 }}>{balance.toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      opacity: 0.92,
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.goldLight }} />
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
                      background: "rgba(255,253,247,.13)",
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
                      border: "1px solid rgba(255,253,247,.3)",
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: 18,
                    borderRadius: 24,
                    background: C.cardSoft,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 13,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Round up to the next</span>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: C.green,
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
                  <span style={{ fontSize: 13, lineHeight: 1.45, color: C.body, textWrap: "pretty" }}>
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
                      color: C.muted,
                    }}
                  >
                    Fractions caught
                  </span>
                  {feedEmpty && (
                    <div
                      style={{
                        padding: "24px 18px",
                        borderRadius: 22,
                        border: "1px dashed #D8CCA6",
                        textAlign: "center",
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: C.muted,
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
                        borderBottom: "1px solid #EFE6D0",
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
                            color: C.cream,
                            background:
                              i % 2 === 0
                                ? `linear-gradient(140deg, ${C.greenBright}, ${C.green})`
                                : `linear-gradient(140deg, ${C.goldLight}, ${C.gold})`,
                          }}
                        >
                          {f.merchant[0]}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                          <span style={{ fontSize: 15, color: C.ink }}>{f.merchant}</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted }}>
                            {eur(f.amount)} → {eur(f.rounded)}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: C.green }}>
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
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontWeight: 400,
                    fontSize: 30,
                    lineHeight: 1.1,
                    color: C.ink,
                  }}
                >
                  Grow some, give some
                </h3>

                <div
                  style={{
                    padding: 18,
                    borderRadius: 24,
                    background: C.cardSoft,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 11,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                    <span style={{ color: C.green }}>Invest {investPct}%</span>
                    <span style={{ color: C.terracotta }}>Donate {donatePct}%</span>
                  </div>
                  <div style={{ height: 12, borderRadius: 99, overflow: "hidden", display: "flex", background: "#E7DCC0" }}>
                    <div
                      style={{
                        background: C.green,
                        transition: "width .35s cubic-bezier(.3,.8,.3,1)",
                        width: investPct + "%",
                      }}
                    />
                    <div
                      style={{
                        background: C.terracotta,
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
                      background: C.cardSoft,
                      border: `1px solid ${C.border}`,
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
                        color: C.green,
                      }}
                    >
                      Invested
                    </span>
                    <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, color: C.ink }}>
                      {eur(invested)}
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 22,
                      background: C.cardSoft,
                      border: `1px solid ${C.border}`,
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
                        color: C.terracotta,
                      }}
                    >
                      Donated
                    </span>
                    <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, color: C.terracottaDeep }}>
                      {eur(donated)}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "18px 18px 14px",
                    borderRadius: 24,
                    background: C.cardSoft,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 13,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Your curve</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted }}>
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
                                ? `linear-gradient(180deg, ${C.greenBright}, ${C.green})`
                                : "#DCE6C8",
                          }}
                        />
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.muted }}>
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
                      color: C.muted,
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
                            border: active ? `1px solid ${C.green}` : `1px solid ${C.border}`,
                            background: active ? "#EAF2DE" : C.cardSoft,
                            color: active ? C.ink : "#5C5646",
                          }}
                        >
                          <span
                            style={{
                              width: 54,
                              height: 54,
                              borderRadius: 16,
                              flex: "none",
                              background: `radial-gradient(120% 120% at 20% 15%, hsl(${c.hue},60%,78%) 0%, hsl(${c.hue + 8},55%,58%) 55%, hsl(${c.hue + 14},50%,40%) 100%)`,
                              boxShadow: "inset 0 -10px 18px -12px rgba(31,61,43,.5)",
                            }}
                          />
                          <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0, textAlign: "left" }}>
                            <span style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</span>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, opacity: 0.72 }}>{c.note}</span>
                          </div>
                          <span
                            style={{
                              marginLeft: "auto",
                              flex: "none",
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              border: active ? `6px solid ${C.green}` : "1px solid #D8CCA6",
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
                    background: C.ink,
                    color: C.cream,
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
                      background: C.greenBright,
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
                        color: C.goldLight,
                      }}
                    >
                      Agent
                    </span>
                    <span style={{ fontSize: 14, lineHeight: 1.45, color: "rgba(251,243,227,.9)", textWrap: "pretty" }}>
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
                borderTop: "1px solid #EEE3C6",
                background: "#FBF6E9",
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
                  background: "rgba(31,61,43,.85)",
                  backdropFilter: "blur(3px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0,
                  color: C.cream,
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
                    opacity: 0.6,
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
                        color: C.goldLight,
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
                        color: C.goldLight,
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
                          background: "rgba(242,200,104,.9)",
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
                          background: "rgba(255,253,247,.6)",
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
                      background: "rgba(255,253,247,.16)",
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
                  background: C.ink,
                  color: C.cream,
                  fontSize: 14,
                  lineHeight: 1.4,
                  display: "flex",
                  gap: 11,
                  alignItems: "center",
                  boxShadow: "0 18px 34px -20px rgba(31,61,43,.7)",
                  animation: "ffIn .3s ease both",
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: "50%", flex: "none", background: C.goldLight }} />
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
              background: C.green,
              animation: "ffRipple 2.6s ease-out infinite",
              zIndex: -1,
            }}
          />
          {phase ? "Capturing…" : "Spend something"}
        </button>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted }}>
          {phase ? "Catching the fraction…" : "Uses a random merchant each tap"}
        </span>
      </div>
    </div>
  );
}

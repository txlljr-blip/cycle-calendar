import { useState } from "react";

const PHASES = [
  {
    name: "Menstrual", nameZh: "月经期",
    days: [1,2,3,4,5], color: "#E8524A", emoji: "🔴",
    desc: "Rest & restore",
    tip: "Light yoga, walking. Low energy — be gentle.",
  },
  {
    name: "Follicular", nameZh: "卵泡期",
    days: [6,7,8,9,10,11,12,13], color: "#F4A261", emoji: "🌱",
    desc: "Rise & energize",
    tip: "Build strength, try new workouts. Creativity peaks.",
  },
  {
    name: "Ovulation", nameZh: "排卵期",
    days: [14,15,16,17], color: "#2EC4B6", emoji: "🥚",
    desc: "Peak power",
    tip: "High-intensity training. Best mood & social energy.",
  },
  {
    name: "Luteal", nameZh: "黄体期",
    days: [18,19,20,21,22,23,24,25,26,27,28], color: "#9B5DE5", emoji: "🌙",
    desc: "Wind down",
    tip: "Pilates, swimming. Honour mood dips — rest is productive.",
  },
];

const MONTHS = ["May", "June"];
const MAY_START_DOF = 4;

function getPhase(day) {
  return PHASES.find((p) => p.days.includes(day));
}

function buildMonthGrid(monthIndex) {
  const totalDays = monthIndex === 0 ? 31 : 30;
  const dow = monthIndex === 0 ? MAY_START_DOF : (MAY_START_DOF + 31) % 7;
  const cells = [];
  for (let i = 0; i < dow; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) {
    const cycleDay = monthIndex === 0 ? d : d + 31;
    cells.push({ date: d, cycleDay: cycleDay <= 28 ? cycleDay : null });
  }
  return cells;
}

export default function CycleCalendar() {
  const [selected, setSelected] = useState(null);
  const [hoveredPhase, setHoveredPhase] = useState(null);
  const selectedPhase = selected ? getPhase(selected.cycleDay) : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c1a 0%, #1a0f2e 50%, #0c1a1f 100%)",
      fontFamily: "'Georgia', serif", padding: "40px 20px", color: "#f0ece8",
    }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 13, letterSpacing: 6, color: "#9B5DE5", textTransform: "uppercase", marginBottom: 8 }}>
          Cycle Tracker
        </div>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 400, margin: 0,
          background: "linear-gradient(135deg, #f0ece8, #E8524A, #9B5DE5)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 2,
        }}>Your Monthly Rhythm</h1>
        <p style={{ color: "#8a8090", margin: "8px 0 0", fontSize: 14, fontStyle: "italic" }}>
          Starting May 1, 2026 · 28-day cycle
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 36 }}>
        {PHASES.map((p) => (
          <div key={p.name}
            onMouseEnter={() => setHoveredPhase(p.name)}
            onMouseLeave={() => setHoveredPhase(null)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 100, cursor: "default", transition: "all 0.2s",
              background: hoveredPhase === p.name ? p.color + "33" : "rgba(255,255,255,0.05)",
              border: `1.5px solid ${hoveredPhase === p.name ? p.color : "rgba(255,255,255,0.1)"}`,
            }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: p.color }}>{p.name}</span>
            <span style={{ fontSize: 11, color: "#8a8090" }}>Day {p.days[0]}–{p.days[p.days.length-1]}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", marginBottom: 32 }}>
        {[0, 1].map((mi) => {
          const cells = buildMonthGrid(mi);
          return (
            <div key={mi} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, padding: 24, width: "min(380px, 100%)",
            }}>
              <h2 style={{ textAlign: "center", margin: "0 0 20px", fontSize: 20, fontWeight: 400, letterSpacing: 4, color: "#d4cece", textTransform: "uppercase" }}>
                {MONTHS[mi]} 2026
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                  <div key={d} style={{ textAlign: "center", fontSize: 10, color: "#5a5060", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", padding: "4px 0" }}>{d}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                {cells.map((cell, i) => {
                  if (!cell) return <div key={i} />;
                  const phase = cell.cycleDay ? getPhase(cell.cycleDay) : null;
                  const isSel = selected && selected.date === cell.date && selected.month === mi;
                  const isHov = hoveredPhase && phase && phase.name === hoveredPhase;
                  return (
                    <div key={i}
                      onClick={() => cell.cycleDay && setSelected(isSel ? null : { date: cell.date, month: mi, cycleDay: cell.cycleDay })}
                      style={{
                        aspectRatio: "1", borderRadius: 10, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 2, cursor: cell.cycleDay ? "pointer" : "default",
                        transition: "all 0.15s", transform: isSel ? "scale(1.1)" : "scale(1)",
                        background: isSel ? phase?.color : isHov ? phase?.color + "44" : phase ? phase.color + "22" : "rgba(255,255,255,0.02)",
                        border: isSel ? `2px solid ${phase?.color}` : isHov ? `1.5px solid ${phase?.color}88` : phase ? `1px solid ${phase?.color}44` : "1px solid transparent",
                        boxShadow: isSel ? `0 4px 16px ${phase?.color}66` : "none",
                      }}>
                      <span style={{ fontSize: 13, fontWeight: isSel ? 700 : 400, color: isSel ? "#fff" : phase ? phase.color : "#5a5060" }}>{cell.date}</span>
                      {cell.cycleDay && <span style={{ fontSize: 8, color: isSel ? "rgba(255,255,255,0.8)" : phase?.color + "99" }}>D{cell.cycleDay}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        maxWidth: 480, margin: "0 auto", minHeight: 120, borderRadius: 20, padding: "24px 28px",
        textAlign: "center", transition: "all 0.3s",
        background: selected && selectedPhase ? selectedPhase.color + "18" : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${selected && selectedPhase ? selectedPhase.color + "55" : "rgba(255,255,255,0.07)"}`,
      }}>
        {selected && selectedPhase ? (
          <>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{selectedPhase.emoji}</div>
            <div style={{ fontSize: 18, color: selectedPhase.color, fontWeight: 600, marginBottom: 4 }}>
              {selectedPhase.name} Phase · Day {selected.cycleDay}
            </div>
            <div style={{ fontSize: 12, color: "#8a8090", marginBottom: 12, letterSpacing: 2, textTransform: "uppercase" }}>
              {selectedPhase.nameZh} · {MONTHS[selected.month]} {selected.date}
            </div>
            <div style={{ fontSize: 13, color: "#c8c0cc", lineHeight: 1.7, fontStyle: "italic" }}>{selectedPhase.tip}</div>
          </>
        ) : (
          <div style={{ color: "#5a5060", fontSize: 13, fontStyle: "italic", lineHeight: 1.8 }}>
            Tap any highlighted day to see your phase details,<br />energy forecast & movement tips.
          </div>
        )}
      </div>
    </div>
  );
}
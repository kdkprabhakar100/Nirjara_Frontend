import { useState, useRef, useCallback } from "react";

type BranchCardProps = {
  number: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  tag: string;
  mapUrl?: string;       // optional Google Maps link
  imageUrl?: string;     // optional branch photo / ambience image
};

// ─── Inline styles as constants for cleanliness ───────────────────────────────
const CARD_STYLE: React.CSSProperties = {
  position: "relative",
  borderRadius: "28px",
  overflow: "hidden",
  cursor: "pointer",
  transition: "transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s cubic-bezier(.22,1,.36,1)",
  background: "#FFFFFF",
  border: "1px solid rgba(231,84,128,.12)",
  boxShadow: "0 2px 16px rgba(231,84,128,.06)",
  fontFamily: "'DM Sans', sans-serif",
  userSelect: "none" as const,
};

export default function BranchCard({
  number,
  name,
  address,
  hours,
  phone,
  tag,
  mapUrl,
  imageUrl,
}: BranchCardProps) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt]       = useState({ x: 0, y: 0 });
  const [copied, setCopied]   = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3-D tilt on mouse-move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 → 0.5
    const py = (e.clientY - rect.top)  / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 10 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleCopyPhone = useCallback(() => {
    navigator.clipboard.writeText(phone).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [phone]);

  const isOpen = (() => {
    try {
      const now = new Date();
      const hour = now.getHours();
      return hour >= 9 && hour < 20;
    } catch { return null; }
  })();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .bc-shine {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(231,84,128,.08) 0%, transparent 60%);
          pointer-events: none;
          transition: opacity .3s;
          z-index: 1;
        }

        @keyframes bcPulse {
          0%, 100% { opacity: .6; transform: scale(1);    }
          50%       { opacity: 1;  transform: scale(1.05); }
        }
        .bc-status-dot {
          display: inline-block;
          width: 7px; height: 7px;
          border-radius: 50%;
          margin-right: 6px;
          vertical-align: middle;
        }
        .bc-status-dot--open  {
          background: #3DB87A;
          animation: bcPulse 2s ease-in-out infinite;
          box-shadow: 0 0 0 3px rgba(61,184,122,.2);
        }
        .bc-status-dot--closed { background: #C0A0A8; }

        .bc-icon-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #8A6F78;
          font-size: 13px;
          line-height: 1.55;
        }
        .bc-icon-row svg { flex-shrink: 0; margin-top: 2px; opacity: .55; }

        .bc-action {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: .22em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: all .22s cubic-bezier(.22,1,.36,1);
          font-weight: 500;
        }
        .bc-action--primary {
          background: #E75480;
          color: white;
          box-shadow: 0 6px 20px rgba(231,84,128,.3);
        }
        .bc-action--primary:hover {
          background: #C03060;
          box-shadow: 0 8px 28px rgba(231,84,128,.45);
          transform: translateY(-1px);
        }
        .bc-action--ghost {
          background: rgba(231,84,128,.06);
          color: #E75480;
          border: 1px solid rgba(231,84,128,.2);
        }
        .bc-action--ghost:hover {
          background: rgba(231,84,128,.12);
          border-color: rgba(231,84,128,.4);
        }
        .bc-copy-toast {
          position: absolute;
          bottom: 90px;
          left: 50%;
          transform: translateX(-50%);
          background: #3A2A2F;
          color: white;
          font-size: 11px;
          padding: 6px 16px;
          border-radius: 100px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 20;
          transition: opacity .2s;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div
        ref={cardRef}
        style={{
          ...CARD_STYLE,
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hovered ? "translateY(-6px)" : "translateY(0)"}`,
          boxShadow: hovered
            ? "0 24px 64px rgba(231,84,128,.18), 0 4px 16px rgba(58,42,47,.08)"
            : "0 2px 16px rgba(231,84,128,.06)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Shine layer */}
        <div
          className="bc-shine"
          style={{ opacity: hovered ? 1 : 0 }}
        />

        {/* ── Image strip (if provided) ──────────────────────────────── */}
        {imageUrl && (
          <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
            <img
              src={imageUrl}
              alt={`${name} branch`}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                transition: "transform .6s cubic-bezier(.22,1,.36,1)",
                transform: hovered ? "scale(1.06)" : "scale(1)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(255,245,248,.95))" }} />
          </div>
        )}

        {/* ── Card body ─────────────────────────────────────────────── */}
        <div style={{ padding: "32px 32px 28px", position: "relative", zIndex: 2 }}>

          {/* Top row: number ornament + live status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "72px",
              fontWeight: 300,
              lineHeight: 1,
              color: "rgba(231,84,128,.1)",
              letterSpacing: "-.04em",
              transition: "color .3s",
              ...(hovered ? { color: "rgba(231,84,128,.18)" } : {}),
            }}>
              {number}
            </span>

            {/* Live open/closed badge */}
            {isOpen !== null && (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                background: isOpen ? "rgba(61,184,122,.08)" : "rgba(192,160,168,.1)",
                color: isOpen ? "#2B9A5E" : "#8A6F78",
                borderRadius: "100px",
                padding: "5px 12px",
                fontSize: "10px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}>
                <span className={`bc-status-dot ${isOpen ? "bc-status-dot--open" : "bc-status-dot--closed"}`} />
                {isOpen ? "Open Now" : "Closed"}
              </span>
            )}
          </div>

          {/* Branch name */}
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            color: "#3A2A2F",
            lineHeight: 1.1,
            letterSpacing: "-.02em",
            marginBottom: "6px",
            transition: "color .25s",
            ...(hovered ? { color: "#E75480" } : {}),
          }}>
            {name}
          </h3>

          {/* Tag pill */}
          <span style={{
            display: "inline-block",
            background: "linear-gradient(90deg, #E75480, #C03060)",
            color: "white",
            borderRadius: "100px",
            padding: "4px 14px",
            fontSize: "9px",
            letterSpacing: ".3em",
            textTransform: "uppercase",
            fontWeight: 500,
            marginBottom: "24px",
          }}>
            {tag}
          </span>

          {/* Divider */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(231,84,128,.25), transparent)", marginBottom: "24px" }} />

          {/* Info rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>

            {/* Address */}
            <div className="bc-icon-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E75480" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{address}</span>
            </div>

            {/* Hours */}
            <div className="bc-icon-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E75480" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{hours}</span>
            </div>

            {/* Phone — clickable to copy */}
            <button
              onClick={handleCopyPhone}
              className="bc-icon-row"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
              title="Click to copy"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E75480" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
              </svg>
              <span style={{ borderBottom: "1px dashed rgba(138,111,120,.3)", transition: "border-color .2s", lineHeight: 1.3 }}>
                {phone}
              </span>
            </button>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {mapUrl ? (
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="bc-action bc-action--primary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Get Directions
                </button>
              </a>
            ) : (
              <button className="bc-action bc-action--primary">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Get Directions
              </button>
            )}

            <button
              className="bc-action bc-action--ghost"
              onClick={handleCopyPhone}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
              </svg>
              {copied ? "Copied!" : "Call Us"}
            </button>
          </div>
        </div>

        {/* Copy toast */}
        {copied && (
          <div className="bc-copy-toast">
            📋 Phone number copied!
          </div>
        )}
      </div>
    </>
  );
}
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { hind, space } from "../fonts";

type Props = {
  n: number;
  headline: string;
  summary: string;
  why: string;
  emoji: string;
  color: string;
};

export const NewsScene = ({ n, headline, summary, why, emoji, color }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sNum = spring({ frame, fps, config: { damping: 12 } });
  const sHead = spring({ frame: frame - 10, fps, config: { damping: 18 } });
  const sSum = spring({ frame: frame - 28, fps, config: { damping: 20 } });
  const sWhy = spring({ frame: frame - 50, fps, config: { damping: 20 } });
  const drift = Math.sin(frame / 40) * 8;
  return (
    <AbsoluteFill style={{ padding: "100px 140px", justifyContent: "center" }}>
      {/* Side accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          bottom: "20%",
          width: 14,
          background: color,
          transform: `scaleY(${sNum})`,
          transformOrigin: "top",
        }}
      />
      {/* Big number */}
      <div
        style={{
          fontFamily: space,
          fontWeight: 700,
          fontSize: 220,
          color: color,
          opacity: 0.25,
          position: "absolute",
          top: 60,
          right: 140,
          transform: `translateY(${(1 - sNum) * 40}px) scale(${0.8 + sNum * 0.2})`,
          lineHeight: 1,
        }}
      >
        0{n}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 30, marginBottom: 30 }}>
        <div style={{ fontSize: 90, transform: `translateY(${drift}px) scale(${sNum})` }}>{emoji}</div>
        <div
          style={{
            fontFamily: space,
            fontSize: 26,
            letterSpacing: 4,
            color: "#fbbf24",
            opacity: sNum,
          }}
        >
          NEWS · {String(n).padStart(2, "0")} OF 06
        </div>
      </div>

      <div
        style={{
          fontFamily: hind,
          fontWeight: 700,
          fontSize: 88,
          color: "#fafafa",
          lineHeight: 1.15,
          maxWidth: 1500,
          opacity: sHead,
          transform: `translateY(${(1 - sHead) * 40}px)`,
        }}
      >
        {headline}
      </div>

      <div
        style={{
          fontFamily: hind,
          fontWeight: 400,
          fontSize: 42,
          color: "#cbd5e1",
          lineHeight: 1.5,
          maxWidth: 1500,
          marginTop: 36,
          opacity: sSum,
          transform: `translateY(${(1 - sSum) * 30}px)`,
        }}
      >
        {summary}
      </div>

      <div
        style={{
          marginTop: 40,
          padding: "22px 32px",
          background: `${color}33`,
          borderLeft: `6px solid ${color}`,
          maxWidth: 1500,
          opacity: sWhy,
          transform: `translateX(${(1 - sWhy) * -40}px)`,
        }}
      >
        <div style={{ fontFamily: space, fontSize: 22, letterSpacing: 3, color: "#fbbf24", marginBottom: 6 }}>
          क्यों ज़रूरी है
        </div>
        <div style={{ fontFamily: hind, fontSize: 36, color: "#fafafa", lineHeight: 1.4 }}>{why}</div>
      </div>
    </AbsoluteFill>
  );
};

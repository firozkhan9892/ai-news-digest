import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { hind, space } from "../fonts";

export const Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: { damping: 16 } });
  const s2 = spring({ frame: frame - 25, fps, config: { damping: 14 } });
  const rocket = interpolate(frame, [40, 180], [0, -120]);
  const rocketX = interpolate(frame, [40, 180], [0, 200]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: hind,
          fontWeight: 700,
          fontSize: 110,
          color: "#fafafa",
          opacity: s1,
          transform: `scale(${0.85 + s1 * 0.15})`,
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        रोज़ाना AI अपडेट के लिए
        <br />
        <span style={{ color: "#fbbf24" }}>फ़ॉलो करें</span>
      </div>
      <div
        style={{
          fontFamily: space,
          fontSize: 36,
          letterSpacing: 6,
          color: "#94a3b8",
          marginTop: 50,
          opacity: s2,
        }}
      >
        DAILY · AI · BRIEF
      </div>
      <div
        style={{
          fontSize: 140,
          marginTop: 30,
          transform: `translate(${rocketX}px, ${rocket}px) rotate(-20deg)`,
        }}
      >
        🚀
      </div>
    </AbsoluteFill>
  );
};

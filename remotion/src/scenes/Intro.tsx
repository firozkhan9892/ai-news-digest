import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { hind, space } from "../fonts";
import data from "../news-data.json";

export const Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: { damping: 18 } });
  const s2 = spring({ frame: frame - 18, fps, config: { damping: 18 } });
  const s3 = spring({ frame: frame - 36, fps, config: { damping: 14 } });
  const out = interpolate(frame, [120, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: out }}>
      <div
        style={{
          fontFamily: space,
          fontSize: 28,
          letterSpacing: 8,
          color: "#fbbf24",
          opacity: s1,
          transform: `translateY(${(1 - s1) * 30}px)`,
        }}
      >
        DAILY · AI · BRIEF
      </div>
      <div
        style={{
          fontFamily: hind,
          fontWeight: 700,
          fontSize: 180,
          color: "#fafafa",
          marginTop: 20,
          opacity: s2,
          transform: `scale(${0.8 + s2 * 0.2})`,
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        AI न्यूज़
      </div>
      <div
        style={{
          fontFamily: hind,
          fontSize: 44,
          color: "#94a3b8",
          marginTop: 16,
          opacity: s3,
        }}
      >
        आज की टॉप {data.news.length} ख़बरें · {data.date}
      </div>
    </AbsoluteFill>
  );
};

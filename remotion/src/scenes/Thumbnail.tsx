import { AbsoluteFill } from "remotion";
import { hind, space } from "../fonts";
import data from "../news-data.json";

// Static YouTube thumbnail (1920x1080) generated from today's top headline.
export const Thumbnail = () => {
  const top = data.news[0];
  const headline = top?.headline ?? "आज की AI न्यूज़";
  const accent = top?.color ?? "#4f46e5";

  return (
    <AbsoluteFill style={{ fontFamily: hind, background: "#0a0a14" }}>
      {/* Layered background glow */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 78% 28%, #20204a 0%, #0d0d1f 45%, #07070f 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(115deg, rgba(79,70,229,0.25) 0%, rgba(10,10,20,0) 55%)",
        }}
      />

      {/* Soft accent blob */}
      <div
        style={{
          position: "absolute",
          right: -180,
          bottom: -180,
          width: 720,
          height: 720,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}55 0%, ${accent}00 70%)`,
        }}
      />

      {/* Top row: badge + date */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 90,
          right: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            background: "#e11d2e",
            padding: "16px 34px",
            borderRadius: 14,
            boxShadow: "0 14px 40px rgba(225,29,46,0.45)",
          }}
        >
          <div style={{ fontSize: 52 }}>🔴</div>
          <div
            style={{
              fontFamily: space,
              fontWeight: 700,
              fontSize: 52,
              letterSpacing: 4,
              color: "#ffffff",
            }}
          >
            AI NEWS
          </div>
        </div>
        <div
          style={{
            fontFamily: hind,
            fontWeight: 700,
            fontSize: 44,
            color: "#0a0a14",
            background: "#fbbf24",
            padding: "14px 32px",
            borderRadius: 999,
          }}
        >
          {data.date}
        </div>
      </div>

      {/* Headline with accent bar */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          gap: 40,
          alignItems: "stretch",
        }}
      >
        <div style={{ width: 22, background: accent, borderRadius: 12 }} />
        <div
          style={{
            fontFamily: hind,
            fontWeight: 700,
            fontSize: 132,
            lineHeight: 1.08,
            color: "#fafafa",
            textShadow: "0 8px 30px rgba(0,0,0,0.55)",
          }}
        >
          {headline}
        </div>
      </div>

      {/* Bottom labels */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 90,
          right: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: space,
            fontSize: 38,
            letterSpacing: 6,
            color: "#94a3b8",
          }}
        >
          DAILY · AI · BRIEF
        </div>
        <div
          style={{
            fontFamily: hind,
            fontWeight: 700,
            fontSize: 40,
            color: "#fbbf24",
          }}
        >
          आज की टॉप {data.news.length} ख़बरें
        </div>
      </div>
    </AbsoluteFill>
  );
};

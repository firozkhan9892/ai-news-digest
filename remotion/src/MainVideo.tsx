import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Audio, staticFile, Sequence } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { Intro } from "./scenes/Intro";
import { NewsScene } from "./scenes/NewsScene";
import { Outro } from "./scenes/Outro";
import { hind } from "./fonts";
import data from "./news-data.json";

const FPS = 30;
const PAD = 18; // ~0.6s padding after audio
const TRANSITION = 16;

export const news = data.news;

const introDur = Math.ceil(data.introSec * FPS) + PAD;
const outroDur = Math.ceil(data.outroSec * FPS) + 60;
const newsDurs = news.map((s) => Math.ceil((s.headSec + s.sumSec) * FPS) + PAD);

export const TOTAL_DURATION =
  introDur + outroDur + newsDurs.reduce((a, b) => a + b, 0) - TRANSITION * (1 + news.length);

export const MainVideo = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const g = interpolate(frame, [0, durationInFrames], [0, 360]);
  return (
    <AbsoluteFill style={{ fontFamily: hind, background: "#0a0a14" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${50 + Math.sin(g / 60) * 20}% ${50 + Math.cos(g / 60) * 20}%, #1a1a2e 0%, #0a0a14 60%)`,
        }}
      />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={introDur}>
          <Intro />
          <Audio src={staticFile("audio/intro.mp3")} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        {news.map((item, i) => {
          const headFrames = Math.ceil(item.headSec * FPS);
          return [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={newsDurs[i]}>
              <NewsScene {...item} total={news.length} />
              <Audio src={staticFile(`audio/news${item.n}_headline.mp3`)} />
              <Sequence from={headFrames}>
                <Audio src={staticFile(`audio/news${item.n}_summary.mp3`)} />
              </Sequence>
            </TransitionSeries.Sequence>,
            <TransitionSeries.Transition
              key={`t${i}`}
              presentation={wipe({ direction: i % 2 === 0 ? "from-right" : "from-left" })}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />,
          ];
        })}
        <TransitionSeries.Sequence durationInFrames={outroDur}>
          <Outro />
          <Audio src={staticFile("audio/outro.mp3")} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { Intro } from "./scenes/Intro";
import { NewsScene } from "./scenes/NewsScene";
import { Outro } from "./scenes/Outro";
import { hind } from "./fonts";

const news = [
  {
    n: 1,
    headline: "पेंटागन के बड़े AI सौदे",
    summary: "अमेरिकी सेना ने Google, Nvidia, SpaceX और OpenAI को क्लासिफाइड सिस्टम के लिए कॉन्ट्रैक्ट दिए। Anthropic इस लिस्ट में नहीं है।",
    why: "AI अब राष्ट्रीय सुरक्षा का अहम हिस्सा बन रहा है।",
    emoji: "🛡️",
    color: "#1e3a5f",
  },
  {
    n: 2,
    headline: "OpenAI ने लॉन्च किया GPT-5.5",
    summary: "नया मॉडल पहले से तेज़ और सस्ता है। साइंटिफिक रिसर्च और प्रोडक्टिविटी एजेंट्स पर खास फोकस।",
    why: "डेवलपर्स को कम कीमत में ज़्यादा पावर मिलेगी।",
    emoji: "🤖",
    color: "#0d7a5f",
  },
  {
    n: 3,
    headline: "Meta ने ख़रीदा रोबोटिक्स स्टार्टअप ARI",
    summary: "Assured Robot Intelligence के अधिग्रहण से Meta ह्यूमनॉइड रोबोट्स की रेस में आगे बढ़ा।",
    why: "बड़ी टेक कंपनियाँ अब फिज़िकल AI की ओर बढ़ रही हैं।",
    emoji: "🦾",
    color: "#4f46e5",
  },
  {
    n: 4,
    headline: "Anthropic का Claude Security बीटा",
    summary: "Claude Opus 4.7 से चलने वाला यह टूल कोडबेस में अपने आप वल्नरेबिलिटी ढूँढता है।",
    why: "AI अब सिक्योरिटी इंजीनियर का काम करने लगा है।",
    emoji: "🔐",
    color: "#c44569",
  },
  {
    n: 5,
    headline: "Musk vs OpenAI केस में खुलासा",
    summary: "ट्रायल में सामने आया कि xAI ने OpenAI के मॉडल्स पर ट्रेनिंग की थी।",
    why: "AI इंडस्ट्री में डेटा और कॉपीराइट की लड़ाई और तेज़ हो गई।",
    emoji: "⚖️",
    color: "#9b4423",
  },
  {
    n: 6,
    headline: "ज़ुकरबर्ग बोले — एजेंट्स अभी कच्चे हैं",
    summary: "मार्क ज़ुकरबर्ग ने कहा कि मौजूदा AI एजेंट्स \"मदर टेस्ट\" पास नहीं करते, यानी अभी पूरी तरह भरोसे लायक नहीं।",
    why: "ऑटोनॉमस AI एजेंट्स की हाइप के बीच रियलिटी चेक।",
    emoji: "🧠",
    color: "#6c5ce7",
  },
];

export const MainVideo = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Subtle global gradient drift
  const g = interpolate(frame, [0, durationInFrames], [0, 360]);
  return (
    <AbsoluteFill style={{ fontFamily: hind, background: "#0a0a14" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${50 + Math.sin(g / 60) * 20}% ${50 + Math.cos(g / 60) * 20}%, #1a1a2e 0%, #0a0a14 60%)`,
        }}
      />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={150}>
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        {news.map((item, i) => (
          <>
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={240}>
              <NewsScene {...item} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              key={`t${i}`}
              presentation={wipe({ direction: i % 2 === 0 ? "from-right" : "from-left" })}
              timing={linearTiming({ durationInFrames: 18 })}
            />
          </>
        ))}
        <TransitionSeries.Sequence durationInFrames={210}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

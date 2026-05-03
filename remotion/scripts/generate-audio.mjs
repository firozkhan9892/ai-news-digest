import fs from "fs";
import path from "path";

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("ELEVENLABS_API_KEY missing. Add it as a Build Secret in Workspace Settings.");
  process.exit(1);
}

// Hindi-capable multilingual voice (Sarah). Override via env if you want.
const VOICE = process.env.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL";
const MODEL = "eleven_multilingual_v2";

const OUT = path.resolve("public/audio");
fs.mkdirSync(OUT, { recursive: true });

// Source of truth: same news content as MainVideo.tsx, split into headline + summary per scene.
const news = [
  {
    n: 1,
    headline: "पहली खबर। पेंटागन के बड़े ए आई सौदे।",
    summary: "अमेरिकी सेना ने Google, Nvidia, SpaceX और OpenAI को क्लासिफाइड सिस्टम के लिए कॉन्ट्रैक्ट दिए। Anthropic इस लिस्ट में नहीं है। ए आई अब राष्ट्रीय सुरक्षा का अहम हिस्सा बन रहा है।",
  },
  {
    n: 2,
    headline: "दूसरी खबर। OpenAI ने लॉन्च किया GPT साढ़े पाँच।",
    summary: "नया मॉडल पहले से तेज़ और सस्ता है। साइंटिफिक रिसर्च और प्रोडक्टिविटी एजेंट्स पर खास फोकस। डेवलपर्स को कम कीमत में ज़्यादा पावर मिलेगी।",
  },
  {
    n: 3,
    headline: "तीसरी खबर। Meta ने ख़रीदा रोबोटिक्स स्टार्टअप ARI।",
    summary: "इस अधिग्रहण से Meta ह्यूमनॉइड रोबोट्स की रेस में आगे बढ़ा। बड़ी टेक कंपनियाँ अब फिज़िकल ए आई की ओर बढ़ रही हैं।",
  },
  {
    n: 4,
    headline: "चौथी खबर। Anthropic का Claude Security बीटा।",
    summary: "Claude Opus 4.7 से चलने वाला यह टूल कोडबेस में अपने आप वल्नरेबिलिटी ढूँढता है। ए आई अब सिक्योरिटी इंजीनियर का काम करने लगा है।",
  },
  {
    n: 5,
    headline: "पाँचवीं खबर। Musk बनाम OpenAI केस में बड़ा खुलासा।",
    summary: "ट्रायल में सामने आया कि xAI ने OpenAI के मॉडल्स पर ट्रेनिंग की थी। डेटा और कॉपीराइट की लड़ाई और तेज़ हो गई।",
  },
  {
    n: 6,
    headline: "छठी खबर। ज़ुकरबर्ग बोले — एजेंट्स अभी कच्चे हैं।",
    summary: "मार्क ज़ुकरबर्ग ने कहा कि मौजूदा ए आई एजेंट्स मदर टेस्ट पास नहीं करते, यानी अभी पूरी तरह भरोसे लायक नहीं। ऑटोनॉमस ए आई की हाइप के बीच रियलिटी चेक।",
  },
];

const segments = [
  { id: "intro", text: "नमस्ते! सुनिए आज की टॉप ए आई न्यूज़, सिर्फ एक मिनट में।" },
  ...news.flatMap((s) => [
    { id: `news${s.n}_headline`, text: s.headline },
    { id: `news${s.n}_summary`, text: s.summary },
  ]),
  { id: "outro", text: "रोज़ाना ए आई अपडेट्स के लिए फ़ॉलो करें!" },
];

async function tts(text) {
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: MODEL,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
          speed: 1.05,
        },
      }),
    }
  );
  if (!r.ok) throw new Error(`TTS ${r.status}: ${await r.text()}`);
  return Buffer.from(await r.arrayBuffer());
}

const force = process.argv.includes("--force");
const manifest = [];

for (const s of segments) {
  const out = path.join(OUT, `${s.id}.mp3`);
  if (!force && fs.existsSync(out)) {
    console.log("skip (exists)", s.id);
  } else {
    console.log("generating", s.id);
    const buf = await tts(s.text);
    fs.writeFileSync(out, buf);
    console.log("  wrote", out, buf.length, "bytes");
  }
  manifest.push({ id: s.id, file: `audio/${s.id}.mp3`, text: s.text });
}

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("\nDONE. Wrote", manifest.length, "audio files +manifest.json");

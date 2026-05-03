import fs from "fs";
import path from "path";

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error("ELEVENLABS_API_KEY missing");

// Hindi female voice (Monika Sogam - multilingual). Fallback to Sarah if needed.
const VOICE = "EXAVITQu4vr4xnSDxMaL"; // Sarah - works with multilingual v2 for Hindi
const MODEL = "eleven_multilingual_v2";

const OUT = path.resolve("public/audio");
fs.mkdirSync(OUT, { recursive: true });

const segments = [
  { id: "intro", text: "नमस्ते! सुनिए आज की टॉप ए आई न्यूज़, सिर्फ एक मिनट में।" },
  { id: "news1", text: "पहली खबर। पेंटागन ने Google, Nvidia, SpaceX और OpenAI को बड़े ए आई कॉन्ट्रैक्ट दिए हैं। Anthropic इस लिस्ट में नहीं है। ए आई अब राष्ट्रीय सुरक्षा का अहम हिस्सा बन रहा है।" },
  { id: "news2", text: "दूसरी खबर। OpenAI ने GPT साढ़े पाँच लॉन्च किया है। यह पहले से तेज़ और सस्ता है, और साइंटिफिक रिसर्च पर फोकस करता है। डेवलपर्स को कम कीमत में ज़्यादा पावर मिलेगी।" },
  { id: "news3", text: "तीसरी खबर। Meta ने रोबोटिक्स स्टार्टअप ARI को ख़रीदा है, ताकि ह्यूमनॉइड रोबोट्स की रेस में आगे बढ़ सके। बड़ी टेक कंपनियाँ अब फिज़िकल ए आई की ओर बढ़ रही हैं।" },
  { id: "news4", text: "चौथी खबर। Anthropic ने Claude Security का बीटा लॉन्च किया है, जो कोड में अपने आप वल्नरेबिलिटी ढूँढता है। ए आई अब सिक्योरिटी इंजीनियर का काम करने लगा है।" },
  { id: "news5", text: "पाँचवीं खबर। Musk बनाम OpenAI केस में खुलासा हुआ कि xAI ने OpenAI के मॉडल्स पर ट्रेनिंग की थी। डेटा और कॉपीराइट की लड़ाई और तेज़ हो गई।" },
  { id: "news6", text: "छठी खबर। मार्क ज़ुकरबर्ग ने कहा कि मौजूदा ए आई एजेंट्स अभी पूरी तरह भरोसे लायक नहीं हैं। ऑटोनॉमस ए आई की हाइप के बीच यह एक रियलिटी चेक है।" },
  { id: "outro", text: "रोज़ाना ए आई अपडेट्स के लिए फ़ॉलो करें!" },
];

for (const s of segments) {
  const out = path.join(OUT, `${s.id}.mp3`);
  if (fs.existsSync(out)) { console.log("skip", s.id); continue; }
  console.log("generating", s.id);
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: s.text,
      model_id: MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true, speed: 1.05 },
    }),
  });
  if (!r.ok) { console.error(await r.text()); throw new Error(`TTS ${s.id} ${r.status}`); }
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(out, buf);
  console.log("  wrote", out, buf.length, "bytes");
}
console.log("DONE");

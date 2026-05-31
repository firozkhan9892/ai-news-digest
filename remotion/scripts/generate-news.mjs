// Generates today's 6 AI news in Hindi using Lovable AI Gateway and writes
// remotion/src/news-data.json. Durations are filled in later by generate-audio.mjs.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../src/news-data.json");

const KEY = process.env.LOVABLE_API_KEY;
if (!KEY) {
  console.error("LOVABLE_API_KEY missing. Add it as a GitHub Actions secret / Build Secret.");
  process.exit(1);
}

const MODEL = process.env.NEWS_MODEL || "google/gemini-3-flash-preview";

// Fixed visual palette + spoken ordinal prefixes (kept stable across days).
const COLORS = ["#1e3a5f", "#0d7a5f", "#4f46e5", "#c44569", "#9b4423", "#6c5ce7"];
const ORDINALS = ["पहली", "दूसरी", "तीसरी", "चौथी", "पाँचवीं", "छठी"];

const dateHindi = new Intl.DateTimeFormat("hi-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

const systemPrompt = `तुम एक हिंदी टेक न्यूज़ एडिटर हो जो रोज़ाना "AI न्यूज़" नाम के YouTube चैनल के लिए स्क्रिप्ट लिखता है।
आज की तारीख़: ${dateHindi}.
पिछले कुछ दिनों की असली और भरोसेमंद आर्टिफिशियल इंटेलिजेंस (AI) से जुड़ी 6 सबसे बड़ी खबरें चुनो — मॉडल लॉन्च, बड़ी कंपनियों के सौदे/अधिग्रहण, रिसर्च, पॉलिसी, या इंडस्ट्री ट्रेंड।
नियम:
- खबरें ताज़ा, ठोस और एक-दूसरे से अलग हों। बनावटी या काल्पनिक खबर मत बनाओ।
- सिर्फ़ valid JSON लौटाओ, कोई markdown या अतिरिक्त टेक्स्ट नहीं।`;

const userPrompt = `JSON इस schema में दो:
{
  "news": [
    {
      "headline": "स्क्रीन पर दिखने वाली छोटी हेडलाइन (कंपनी/प्रोडक्ट के नाम अंग्रेज़ी में रख सकते हो, जैसे OpenAI, Meta)",
      "summary": "2 छोटे वाक्य, स्क्रीन पर दिखने के लिए",
      "why": "एक वाक्य — यह खबर क्यों ज़रूरी है",
      "emoji": "एक प्रासंगिक emoji",
      "spokenHeadline": "बोलने के लिए हेडलाइन — पूरी तरह देवनागरी में, 'AI' की जगह 'ए आई', 'GPT-5.5' की जगह 'जी पी टी साढ़े पाँच' जैसे उच्चारण लिखो",
      "spokenSummary": "बोलने के लिए summary+why मिलाकर — पूरी तरह सुनने में सहज देवनागरी, संख्याएँ/शॉर्टफॉर्म उच्चारण में"
    }
  ]
}
ठीक 6 items दो।`;

async function generate() {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (r.status === 429) throw new Error("Rate limited (429). Try again later.");
  if (r.status === 402) throw new Error("Lovable AI credits exhausted (402). Add credits in Settings > Workspace > Usage.");
  if (!r.ok) throw new Error(`AI Gateway ${r.status}: ${await r.text()}`);

  const json = await r.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content returned from AI gateway");
  return JSON.parse(content);
}

const parsed = await generate();
const items = parsed.news;
if (!Array.isArray(items) || items.length < 6) {
  throw new Error(`Expected 6 news items, got ${items?.length}`);
}

const news = items.slice(0, 6).map((it, i) => {
  const n = i + 1;
  const spokenHeadline = `${ORDINALS[i]} खबर। ${String(it.spokenHeadline || it.headline).trim()}`;
  return {
    n,
    emoji: it.emoji || "🤖",
    color: COLORS[i % COLORS.length],
    headline: String(it.headline).trim(),
    summary: String(it.summary).trim(),
    why: String(it.why).trim(),
    spokenHeadline,
    spokenSummary: String(it.spokenSummary || it.summary).trim(),
    // Placeholder durations; filled by generate-audio.mjs after TTS.
    headSec: 4,
    sumSec: 9,
  };
});

const out = {
  date: dateHindi,
  introText: "नमस्ते! सुनिए आज की टॉप ए आई न्यूज़, सिर्फ एक मिनट में।",
  outroText: "रोज़ाना ए आई अपडेट्स के लिए फ़ॉलो करें!",
  introSec: 3.9,
  outroSec: 2.51,
  news,
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log("Wrote", OUT, "with", news.length, "fresh news items for", dateHindi);

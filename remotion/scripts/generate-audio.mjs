// Reads remotion/src/news-data.json, generates Hindi TTS audio with ElevenLabs,
// measures each clip's real duration with ffprobe, and writes the durations
// back into news-data.json so the Remotion composition timing stays in sync.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(__dirname, "../src/news-data.json");

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("ELEVENLABS_API_KEY missing. Add it as a GitHub Actions secret / Build Secret.");
  process.exit(1);
}

// George (male, multilingual). Override via env if you want a different voice.
const VOICE = process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
const MODEL = "eleven_multilingual_v2";

const OUT = path.resolve(__dirname, "../public/audio");
fs.mkdirSync(OUT, { recursive: true });

const data = JSON.parse(fs.readFileSync(DATA, "utf8"));

const segments = [
  { id: "intro", text: data.introText },
  ...data.news.flatMap((s) => [
    { id: `news${s.n}_headline`, text: s.spokenHeadline },
    { id: `news${s.n}_summary`, text: s.spokenSummary },
  ]),
  { id: "outro", text: data.outroText },
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

function durationOf(file) {
  const out = execSync(
    `ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`
  )
    .toString()
    .trim();
  return parseFloat(out);
}

const force = process.argv.includes("--force");
const manifest = [];
const durations = {};

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
  durations[s.id] = durationOf(out);
  manifest.push({ id: s.id, file: `audio/${s.id}.mp3`, text: s.text });
}

// Write measured durations back into news-data.json.
data.introSec = durations.intro;
data.outroSec = durations.outro;
for (const s of data.news) {
  s.headSec = durations[`news${s.n}_headline`];
  s.sumSec = durations[`news${s.n}_summary`];
}
fs.writeFileSync(DATA, JSON.stringify(data, null, 2) + "\n");
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

console.log("\nDONE. Wrote", manifest.length, "audio files + manifest.json, durations synced into news-data.json");

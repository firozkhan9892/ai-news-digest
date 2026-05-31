import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUT_DIR = process.env.OUTPUT_DIR || "/mnt/documents";
fs.mkdirSync(OUT_DIR, { recursive: true });

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});

// Use an explicit chromium only when available (sandbox); otherwise let Remotion
// download and manage its own headless shell (CI runners).
const explicitChrome =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  (fs.existsSync("/bin/chromium") ? "/bin/chromium" : undefined);

const browser = await openBrowser("chrome", {
  browserExecutable: explicitChrome,
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({
  serveUrl: bundled,
  id: "main",
  puppeteerInstance: browser,
});

const videoPath = "/tmp/video-mute.mp4";
const audioPath = "/tmp/video-audio.wav";
const outPath = path.join(OUT_DIR, "ai-news-hindi.mp4");
const thumbPath = path.join(OUT_DIR, "ai-news-thumbnail.png");

console.log("Rendering muted video...");
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: videoPath,
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});

console.log("Rendering audio track...");
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "wav",
  outputLocation: audioPath,
  puppeteerInstance: browser,
  concurrency: 1,
});

console.log("Rendering thumbnail...");
const thumbComposition = await selectComposition({
  serveUrl: bundled,
  id: "thumbnail",
  puppeteerInstance: browser,
});
await renderStill({
  composition: thumbComposition,
  serveUrl: bundled,
  output: thumbPath,
  puppeteerInstance: browser,
});

await browser.close({ silent: false });

console.log("Muxing with system ffmpeg (native aac)...");
execSync(
  `ffmpeg -y -i ${videoPath} -i ${audioPath} -c:v copy -c:a aac -b:a 192k -shortest ${outPath}`,
  { stdio: "inherit" }
);

console.log("DONE");
console.log("  video:", outPath);
console.log("  thumbnail:", thumbPath);

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
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
const outPath = "/mnt/documents/ai-news-hindi.mp4";

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

await browser.close({ silent: false });

console.log("Muxing with system ffmpeg (native aac)...");
fs.rmSync(outPath, { force: true });
execSync(
  `ffmpeg -y -i ${videoPath} -i ${audioPath} -c:v copy -c:a aac -b:a 192k -shortest ${outPath}`,
  { stdio: "inherit" }
);

console.log("DONE", outPath);

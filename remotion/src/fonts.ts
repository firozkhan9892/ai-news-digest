import { loadFont as loadHind } from "@remotion/google-fonts/NotoSansDevanagari";
import { loadFont as loadSpace } from "@remotion/google-fonts/SpaceGrotesk";

export const hind = loadHind("normal", { weights: ["400", "700"], subsets: ["devanagari", "latin"] }).fontFamily;
export const space = loadSpace("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;

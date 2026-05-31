import { Composition, Still } from "remotion";
import { MainVideo, TOTAL_DURATION } from "./MainVideo";
import { Thumbnail } from "./scenes/Thumbnail";

export const RemotionRoot = () => (
  <>
    <Composition
      id="main"
      component={MainVideo}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
    <Still id="thumbnail" component={Thumbnail} width={1920} height={1080} />
  </>
);

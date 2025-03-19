import React from "react";
import { extractVideoId } from "../../util/videoUtils/extract_video_id";

interface RenderYoutubeVideoProps {
  videoUrl: string;
}

const RenderYoutubeVideo: React.FC<RenderYoutubeVideoProps> = ({
  videoUrl,
}) => {
  const videoId = extractVideoId(videoUrl);
  return (
    <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default RenderYoutubeVideo;

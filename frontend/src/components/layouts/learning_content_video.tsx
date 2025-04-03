import React from "react";
import RenderYoutubeVideo from "../videos/render_youtube_video";

interface LearningContentVideoLayoutProps {
  videoUrl: string;
  title: string;
  description: string;
  supplementaryContent?: { label: string; url: string }[];
}

const LearningContentVideoLayout: React.FC<LearningContentVideoLayoutProps> = ({
  videoUrl,
  title,
  description,
  supplementaryContent,
}) => {
  return (
    <div className="flex flex-col gap-7 justify-center items-center">
      {/* Video */}
      <div className="w-full max-w-full aspect-video">
        <RenderYoutubeVideo videoUrl={videoUrl} />
      </div>

      {/* Beschreibung unter dem Video */}
      <div className="p-6 border border-gray-300 rounded-lg w-full">
        <h2 className="text-xl font-bold">{title}</h2>
        <p>{description}</p>
      </div>

      {/* Zusätzliche Ressourcen */}
      {supplementaryContent && supplementaryContent.length > 0 && (
        <div className="p-6 w-full bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-1">Zusätzliche Ressourcen</h3>
          <ul className="list-disc list-inside">
            {supplementaryContent.map((item, index) => (
              <li key={index}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={item.url}
                  className="text-blue-500 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LearningContentVideoLayout;

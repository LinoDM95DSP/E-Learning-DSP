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
    <div className="flex flex-col gap-10 justify-center items-center">
      <div className="flex gap-3 align-items: stretch">
        <div className="w-full">
          <RenderYoutubeVideo videoUrl={videoUrl} />
        </div>

        <div className="p-6 w-1/2 border-1 border-gray-300 rounded-lg ">
          <h2 className="text-xl font-bold">{title}</h2>
          <p>{description}</p>
        </div>
      </div>

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

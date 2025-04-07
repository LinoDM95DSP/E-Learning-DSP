import React from "react";
import RenderYoutubeVideo from "../videos/render_youtube_video";
import type { Task } from "../tags/tag_calculated_difficulty";
import { GoBook } from "react-icons/go";
import { BsSpeedometer2 } from "react-icons/bs";
import type { DifficultyLevel } from "../tags/tag_difficulty";

interface LearningContentVideoLayoutProps {
  videoUrl: string;
  title: string;
  description: string;
  supplementaryContent?: { label: string; url: string }[];
  progress: number;
  currentLessonIndex: number;
  totalLessons: number;
  tasks?: Task[];
}

const LearningContentVideoLayout: React.FC<LearningContentVideoLayoutProps> = ({
  videoUrl,
  title,
  description,
  supplementaryContent,
  progress,
  currentLessonIndex,
  totalLessons,
  tasks,
}) => {
  const calculateAverageDifficulty = (
    localTasks?: Task[]
  ): DifficultyLevel | null => {
    if (!localTasks || localTasks.length === 0) {
      return null;
    }
    const difficultyMap: Record<DifficultyLevel, number> = {
      Einfach: 1,
      Mittel: 2,
      Schwer: 3,
    };
    const totalDifficultyScore = localTasks.reduce(
      (sum, task) => sum + (difficultyMap[task.difficulty] || 0),
      0
    );
    const averageScore = totalDifficultyScore / localTasks.length;
    if (averageScore < 1.7) {
      return "Einfach";
    } else if (averageScore <= 2.3) {
      return "Mittel";
    } else {
      return "Schwer";
    }
  };

  const calculatedDifficultyText = calculateAverageDifficulty(tasks);

  return (
    <div className="flex flex-col gap-7 justify-center items-center">
      {/* Video */}
      <div className="w-full max-w-full aspect-video">
        <RenderYoutubeVideo videoUrl={videoUrl} />
      </div>

      {/* Beschreibung unter dem Video */}
      <div className="p-6 border bg-white border-gray-300 rounded-lg w-full">
        <h1 className="mb-2">Über dieses Modul</h1>
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div className="mb-4 space-y-2">
          <div className="flex gap-5 items-center text-sm">
            <span className="flex items-center gap-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg p-1 px-2 ">
              <span>
                <GoBook className="text-dsp-orange" />
              </span>
              Lektionen: {currentLessonIndex + 1} von {totalLessons}
            </span>
            {calculatedDifficultyText && (
              <span className="flex items-center gap-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg p-1 px-2 ">
                <span>
                  <BsSpeedometer2 className="text-dsp-orange" />
                </span>
                Modulschwierigkeit: {calculatedDifficultyText}
              </span>
            )}
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Fortschritt
              </span>
              <span className="text-sm font-medium text-gray-700">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-dsp-orange h-2.5 rounded-full transition-width duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <p className="">{description}</p>
      </div>

      {/* Zusätzliche Ressourcen */}
      {supplementaryContent && supplementaryContent.length > 0 && (
        <div className="p-6 w-full bg-white border border-gray-300 rounded-lg">
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

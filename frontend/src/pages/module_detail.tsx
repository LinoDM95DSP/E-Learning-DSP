import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/swiper-bundle.css";
import TagDifficulty from "../components/tags/tag_difficulty";
import type { DifficultyLevel } from "../components/tags/tag_difficulty";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import Breadcrumbs from "../components/ui_elements/breadcrumbs";

import modulesObj from "../util/modules/modules_object";
import LearningContentVideoLayout from "../components/layouts/learning_content_video";
import ButtonSwipe from "../components/ui_elements/buttons/button_swipe";

// Definiere explizite Typen für den Modulinhalt
interface ContentItem {
  contentId: string;
  videoUrl: string;
  title: string;
  description: string;
  supplementaryTitle?: string;
  supplementaryContent?: { label: string; url: string }[];
}

function ModuleDetail() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const module = modulesObj.find((mod) => mod.id === moduleId);

  if (!module) {
    return <p>Modul nicht gefunden.</p>;
  }

  const tasks = module.tasks || [];
  const moduleProgress = module.progress;

  // Bestimme Lektionsanzahl basierend auf dem Typ
  const totalLessons = Array.isArray(module.content)
    ? module.content.length
    : 1;

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  // --- Breadcrumb Items ---
  const breadcrumbItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Module", path: "/modules" },
    { label: module.title }, // Aktuelles Modul
  ];

  return (
    <div className="p-6 flex flex-col">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      {/* Kombinierter Container für Titel, Subtitel und Buttons */}
      <div className="flex justify-between items-start mb-6">
        {/* Linke Seite: Titel und Subtitel */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{module.title}</h1>
          <p className="text-base text-gray-600 mt-1">
            Vertiefe dein Wissen mit Videos, Texten und Aufgaben.
          </p>
        </div>

        {/* Rechte Seite: Buttons */}
        <div className="flex gap-3 flex-shrink-0">
          <ButtonSwipe
            onClick={handlePrev}
            icon={<TbTriangleInvertedFilled />}
            classNameIcon="rotate-90"
          />
          <ButtonSwipe
            onClick={handleNext}
            icon={<TbTriangleInvertedFilled />}
            classNameIcon="rotate-270"
          />
        </div>
      </div>

      {/* Spalte 1 */}
      <div className="flex gap-6">
        <div className="w-2/3 max-w-full overflow-hidden">
          <div className="w-full max-w-full">
            {Array.isArray(module.content) ? (
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
              >
                {module.content.map((video: ContentItem, index: number) => (
                  <SwiperSlide key={video.contentId}>
                    <LearningContentVideoLayout
                      {...video}
                      progress={moduleProgress}
                      currentLessonIndex={index}
                      totalLessons={totalLessons}
                      tasks={tasks as Task[]}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <LearningContentVideoLayout
                {...module.content}
                progress={moduleProgress}
                currentLessonIndex={0}
                totalLessons={totalLessons}
                tasks={tasks as Task[]}
              />
            )}
          </div>
        </div>

        {/* Spalte 2 */}
        <div className="w-1/3 max-w-full overflow-hidden bg-white border border-gray-300 rounded-lg p-4 self-start">
          <h2 className="text-lg font-semibold mb-4 ">Aufgaben</h2>
          {tasks.length > 0 ? (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition"
                  onClick={() =>
                    navigate(`/module/${moduleId}/task/${task.id}`)
                  }
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-bold mb-1">{task.title}</h3>
                    <TagDifficulty
                      difficulty={task.difficulty as DifficultyLevel}
                    />
                  </div>

                  <p className="text-sm text-gray-600">{task.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              Keine Aufgaben für dieses Modul verfügbar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Wichtig: Task-Typ muss hier ebenfalls verfügbar sein oder importiert werden
interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
}

export default ModuleDetail;

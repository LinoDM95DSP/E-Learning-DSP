import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";

import { TbTriangleInvertedFilled } from "react-icons/tb";

import modulesObj from "../util/modules/modules_object";
import LearningContentVideoLayout from "../components/layouts/learning_content_video";
import ButtonSwipe from "../components/ui_elements/buttons/button_swipe";

function ModuleDetail() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const module = modulesObj.find((mod) => mod.id === moduleId);

  if (!module) {
    return <p>Modul nicht gefunden.</p>;
  }

  const tasks = module.tasks || [];

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

  return (
    <div className="max-w-screen-xl mx-auto flex gap-6">
      {/* Spalte 1 */}

      <div className="w-full max-w-full overflow-hidden">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">{module.title}</h1>
          <div className="flex gap-3">
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
        <div className="w-full max-w-full">
          {Array.isArray(module.content) ? (
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {module.content.map((video) => (
                <SwiperSlide key={video.contentId}>
                  <LearningContentVideoLayout {...video} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <LearningContentVideoLayout {...module.content} />
          )}
        </div>
      </div>

      {/* Spalte 2 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Aufgaben</h2>
        {tasks.length > 0 ? (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-4 border rounded-md shadow-sm cursor-pointer hover:bg-gray-100 transition"
                onClick={() => navigate(`/module/${moduleId}/task/${task.id}`)}
              >
                <h3 className="text-md font-bold mb-1">{task.title}</h3>
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
  );
}

export default ModuleDetail;

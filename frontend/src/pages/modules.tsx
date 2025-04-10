// Modules.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CardPreviewSmall from "../components/cards/card_preview_small";
import FilterHead from "../components/filter/filter_head";
import TagCalculatedDifficulty from "../components/tags/tag_calculated_difficulty";
import type { DifficultyLevel } from "../components/tags/tag_difficulty";
import Breadcrumbs from "../components/ui_elements/breadcrumbs";
import { useModules, Module, Task } from "../context/ModuleContext";

function Modules() {
  const { modules, loading, error, fetchModules } = useModules();
  const [activeFilters, setActiveFilters] = useState<DifficultyLevel[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const getFirstYoutubeId = (module: Module): string | undefined => {
    const firstContentWithVideo = module.contents?.find((c) => c.video_url);
    const videoUrl = firstContentWithVideo?.video_url;
    if (!videoUrl) return undefined;
    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /watch\?v=([a-zA-Z0-9_-]{11})/,
      /embed\/([a-zA-Z0-9_-]{11})/,
      /v\/([a-zA-Z0-9_-]{11})/,
      /\/([a-zA-Z0-9_-]{11})($|\?|#)/,
    ];
    for (const pattern of patterns) {
      const match = videoUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    console.warn(`Could not extract YouTube ID from URL: ${videoUrl}`);
    return undefined;
  };

  const handleFilterChange = (difficulty: DifficultyLevel) => {
    setActiveFilters((prevFilters) => {
      if (prevFilters.includes(difficulty)) {
        return prevFilters.filter((f) => f !== difficulty);
      } else {
        return [...prevFilters, difficulty];
      }
    });
  };

  const filteredModules = modules.filter((module: Module) => {
    const calculateDifficultyForFilter = (
      tasksForFilter?: Task[]
    ): DifficultyLevel | null => {
      if (!tasksForFilter || tasksForFilter.length === 0) return null;
      const difficultyMap: Record<string, number> = {
        Einfach: 1,
        Mittel: 2,
        Schwer: 3,
      };
      const totalDifficultyScore = tasksForFilter.reduce(
        (sum, task) => sum + (difficultyMap[task.difficulty] || 0),
        0
      );
      const averageScore = totalDifficultyScore / tasksForFilter.length;
      if (averageScore < 1.7) return "Einfach";
      else if (averageScore <= 2.3) return "Mittel";
      else return "Schwer";
    };
    const difficultyMatch = (() => {
      if (activeFilters.length === 0) return true;
      const avgDifficulty = calculateDifficultyForFilter(module.tasks);
      return avgDifficulty !== null && activeFilters.includes(avgDifficulty);
    })();
    const searchMatch =
      searchTerm === "" ||
      module.title.toLowerCase().includes(searchTerm.toLowerCase());
    return difficultyMatch && searchMatch;
  });

  const breadcrumbItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Module" },
  ];

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Lade Module...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Modulübersicht
        </h1>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Fehler beim Laden!</strong>
          <span className="block sm:inline"> {error.message}</span>
          <button
            onClick={fetchModules}
            className="ml-4 mt-2 sm:mt-0 px-3 py-1 text-sm bg-red-200 text-red-800 rounded hover:bg-red-300"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <h1 className="text-3xl font-bold text-gray-800">Modulübersicht</h1>
      <p className="text-base text-gray-600 mb-6">
        Entdecke unsere Lernmodule und filtere nach deinen Interessen.
      </p>

      <div className="mb-8">
        <FilterHead
          title=""
          searchTerm={searchTerm}
          activeDifficultyFilters={activeFilters}
          onSearchChange={setSearchTerm}
          onDifficultyFilterChange={handleFilterChange}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filteredModules.length > 0 ? (
          filteredModules.map((module: Module) => {
            const moduleTasks = module.tasks || [];
            const totalTasksInModule = moduleTasks.length;
            const completedTasksInModule = moduleTasks.filter(
              (task) => task.completed
            ).length;
            const progressPercent =
              totalTasksInModule > 0
                ? (completedTasksInModule / totalTasksInModule) * 100
                : 0;

            const roundedProgressPercent = Math.round(progressPercent);

            return (
              <Link
                key={module.id}
                to={`/modules/${module.id}`}
                className="block relative"
              >
                <CardPreviewSmall
                  title={module.title}
                  youtubeId={getFirstYoutubeId(module)}
                  progress={roundedProgressPercent}
                  className="w-full h-full hover:bg-dsp-orange_light transition-all duration-300 ease-in-out border border-gray-300"
                  classNameTitle="text-left text-2xl"
                />
                {module.tasks && module.tasks.length > 0 && (
                  <div className="absolute top-4 right-4">
                    <TagCalculatedDifficulty tasks={module.tasks} />
                  </div>
                )}
              </Link>
            );
          })
        ) : (
          <p className="text-gray-600 md:col-span-2 xl:col-span-3">
            Keine Module gefunden, die den Filterkriterien entsprechen.
          </p>
        )}
      </div>
    </div>
  );
}

export default Modules;

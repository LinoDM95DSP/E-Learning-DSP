// Modules.tsx
import { Link } from "react-router-dom";
import CardPreviewSmall from "../components/cards/card_preview_small";
import modulesObj from "../util/modules/modules_object";
import { useState } from "react";
import FilterHead from "../components/filter/filter_head";
import TagCalculatedDifficulty from "../components/tags/tag_calculated_difficulty";
import type { DifficultyLevel } from "../components/tags/tag_difficulty";
import Breadcrumbs from "../components/ui_elements/breadcrumbs";

interface ModuleContent {
  contentId: string;
  videoUrl: string;
  title: string;
  description: string;
  supplementaryTitle?: string;
  supplementaryContent?: { label: string; url: string }[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
}

interface Module {
  id: string;
  title: string;
  progress: number;
  content: ModuleContent | ModuleContent[];
  tasks?: Task[];
}

function Modules() {
  const [activeFilters, setActiveFilters] = useState<DifficultyLevel[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const getFirstYoutubeId = (module: Module): string | undefined => {
    const contentArray = Array.isArray(module.content)
      ? module.content
      : [module.content];

    const firstVideoUrl = contentArray?.[0]?.videoUrl;
    if (!firstVideoUrl) return;

    const match = firstVideoUrl.match(/embed\/([a-zA-Z0-9_-]{11})/);
    return match?.[1];
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

  const filteredModules = modulesObj.filter((module) => {
    const calculateDifficultyForFilter = (
      tasksForFilter?: Task[]
    ): DifficultyLevel | null => {
      if (!tasksForFilter || tasksForFilter.length === 0) return null;
      const difficultyMap: Record<DifficultyLevel, number> = {
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
      const avgDifficulty = calculateDifficultyForFilter(
        module.tasks as Task[]
      );
      return avgDifficulty !== null && activeFilters.includes(avgDifficulty);
    })();

    const searchMatch =
      searchTerm === "" ||
      module.title.toLowerCase().includes(searchTerm.toLowerCase());

    return difficultyMatch && searchMatch;
  });

  // --- Breadcrumb Items ---
  const breadcrumbItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Module" },
  ];

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

      {/* Responsive Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filteredModules.map((module) => {
          return (
            <Link
              key={module.id}
              to={`/modules/${module.id}`}
              className="block relative"
            >
              <CardPreviewSmall
                title={module.title}
                progress={module.progress}
                youtubeId={getFirstYoutubeId(module as Module)}
                className="w-full h-full hover:bg-dsp-orange_light transition-all duration-300 ease-in-out border border-gray-300"
                classNameTitle="text-left text-2xl"
                classNameDescription="text-left"
              />
              <div className="absolute top-4 right-4">
                <TagCalculatedDifficulty tasks={module.tasks as Task[]} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Modules;

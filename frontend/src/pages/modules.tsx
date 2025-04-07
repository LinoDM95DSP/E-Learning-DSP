// Modules.tsx
import { Link } from "react-router-dom";
import CardPreviewSmall from "../components/cards/card_preview_small";
import modulesObj from "../util/modules/modules_object";
import TagDifficulty from "../components/tags/tag_difficulty";
import type { DifficultyLevel } from "../components/tags/tag_difficulty";
import { useState } from "react";
import FilterHead from "../components/filter/filter_head";

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

  const calculateAverageDifficulty = (
    module: Module
  ): DifficultyLevel | null => {
    const tasks = module.tasks;
    if (!tasks || tasks.length === 0) {
      return null; // Keine Aufgaben, keine Schwierigkeit
    }

    const difficultyMap: Record<DifficultyLevel, number> = {
      Einfach: 1,
      Mittel: 2,
      Schwer: 3,
    };

    const totalDifficultyScore = tasks.reduce(
      (sum, task) => sum + (difficultyMap[task.difficulty] || 0), // Fallback auf 0, falls ungültig
      0
    );

    const averageScore = totalDifficultyScore / tasks.length;

    // Wandle den Durchschnittswert zurück in eine Kategorie um
    if (averageScore < 1.7) {
      return "Einfach";
    } else if (averageScore <= 2.3) {
      return "Mittel";
    } else {
      return "Schwer";
    }
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
    // Schwierigkeitsfilter prüfen
    const difficultyMatch = (() => {
      if (activeFilters.length === 0) {
        return true; // Kein Filter aktiv
      }
      const avgDifficulty = calculateAverageDifficulty(module as Module);
      return avgDifficulty !== null && activeFilters.includes(avgDifficulty);
    })();

    // Suchbegriff prüfen (Groß-/Kleinschreibung ignorieren)
    const searchMatch =
      searchTerm === "" ||
      module.title.toLowerCase().includes(searchTerm.toLowerCase());

    return difficultyMatch && searchMatch; // Beide müssen zutreffen
  });

  return (
    <div className="p-4">
      <FilterHead
        title="Module"
        searchTerm={searchTerm}
        activeDifficultyFilters={activeFilters}
        onSearchChange={setSearchTerm}
        onDifficultyFilterChange={handleFilterChange}
      />

      {/* Responsive Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filteredModules.map((module) => {
          const avgDifficulty = calculateAverageDifficulty(module as Module);
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
              {avgDifficulty && (
                <div className="absolute top-4 right-4">
                  <TagDifficulty difficulty={avgDifficulty} />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Modules;

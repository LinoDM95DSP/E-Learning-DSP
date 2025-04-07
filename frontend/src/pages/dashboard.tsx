import React, { useState } from "react";
import { Link } from "react-router-dom";
import modulesObj from "../util/modules/modules_object";
import TagDifficulty from "../components/tags/tag_difficulty";
import type { DifficultyLevel } from "../components/tags/tag_difficulty";
// Importiere Icons
import {
  IoLibraryOutline,
  IoStatsChartOutline,
  IoListOutline,
  IoSchoolOutline,
  IoPlayCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { BsSpeedometer2 } from "react-icons/bs";
import Breadcrumbs from "../components/ui_elements/breadcrumbs";

// Definiere Typen (oder importiere zentral)

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  hint?: string;
}

function Dashboard() {
  // --- State für die Anzeige aller Module ---
  const [showAllInProgress, setShowAllInProgress] = useState(false);

  // --- Statistische Berechnungen (Benutzerunabhängig) ---
  const totalModules = modulesObj.length;

  const allTasks: Task[] = modulesObj.flatMap((m) => (m.tasks || []) as Task[]);
  const totalTasks = allTasks.length;
  const averageTasksPerModule =
    totalModules > 0 ? (totalTasks / totalModules).toFixed(1) : 0; // Berechne Ø Aufgaben

  const totalLessons = modulesObj.reduce((sum, m) => {
    const content = m.content;
    return sum + (Array.isArray(content) ? content.length : content ? 1 : 0); // Zähle Lektionen
  }, 0);

  const averageLessonsPerModule =
    totalModules > 0 ? (totalLessons / totalModules).toFixed(1) : "0.0"; // NEU

  const tasksByDifficulty = allTasks.reduce((acc, task) => {
    acc[task.difficulty] = (acc[task.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<DifficultyLevel, number>);

  // Berechne durchschnittliche Schwierigkeit *pro Modul*
  const calculateModuleDifficulty = (
    tasks?: Task[]
  ): DifficultyLevel | null => {
    if (!tasks || tasks.length === 0) return null;
    const difficultyMap: Record<DifficultyLevel, number> = {
      Einfach: 1,
      Mittel: 2,
      Schwer: 3,
    };
    const totalDifficultyScore = tasks.reduce(
      (sum, task) => sum + (difficultyMap[task.difficulty] || 0),
      0
    );
    const averageScore = totalDifficultyScore / tasks.length;
    if (averageScore < 1.7) return "Einfach";
    else if (averageScore <= 2.3) return "Mittel";
    else return "Schwer";
  };

  const modulesByAvgDifficulty = modulesObj.reduce((acc, module) => {
    const avgDifficulty = calculateModuleDifficulty(module.tasks as Task[]);
    if (avgDifficulty) {
      acc[avgDifficulty] = (acc[avgDifficulty] || 0) + 1;
    }
    return acc;
  }, {} as Record<DifficultyLevel, number>);

  // Module mit meisten/wenigsten Aufgaben finden (NEU)
  let maxTasks = -1,
    minTasks = Infinity;
  let modulesWithMostTasks: string[] = [];
  let modulesWithLeastTasks: string[] = [];

  modulesObj.forEach((module) => {
    const taskCount = module.tasks?.length || 0;
    if (taskCount > maxTasks) {
      maxTasks = taskCount;
      modulesWithMostTasks = [module.title];
    } else if (taskCount === maxTasks) {
      modulesWithMostTasks.push(module.title);
    }
    if (taskCount > 0 && taskCount < minTasks) {
      minTasks = taskCount;
      modulesWithLeastTasks = [module.title];
    } else if (taskCount > 0 && taskCount === minTasks) {
      modulesWithLeastTasks.push(module.title);
    }
  });
  if (minTasks === Infinity) minTasks = 0;

  // --- Benutzerspezifische Berechnungen (angepasst auf Mock-Daten) ---
  const inProgressModules = Object.values(modulesObj).filter((module) => {
    // Verwende den Mock-Fortschritt aus modulesObj
    // Annahme: progress ist eine Zahl 0-100
    return (
      module.progress !== undefined &&
      module.progress > 0 &&
      module.progress < 100
    );
  });

  // Helper Funktion zum Extrahieren der YouTube Video ID
  const getYouTubeVideoId = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      // Funktioniert für youtube.com/embed/ID und youtube.com/watch?v=ID
      if (
        urlObj.hostname.includes("youtube.com") ||
        urlObj.hostname.includes("youtu.be")
      ) {
        if (urlObj.pathname.includes("/embed/")) {
          return urlObj.pathname.split("/embed/")[1].split(/[?&]/)[0];
        }
        if (urlObj.searchParams.has("v")) {
          return urlObj.searchParams.get("v");
        }
      }
      // Fallback für youtu.be/ID URLs
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.substring(1).split(/[?&]/)[0];
      }
    } catch (e) {
      console.error("Error parsing video URL:", e);
      return null;
    }
    return null;
  };

  // --- Platzhalterdaten für Fristen ---
  const upcomingDeadlines = [
    {
      id: "deadline1",
      title: "Python Projekt einreichen",
      context: "Python Grundlagen",
      dueDate: "15. Okt 2024", // Beispiel-Datum
    },
    {
      id: "deadline2",
      title: "Excel Abschlusstest",
      context: "Excel Fortgeschritten",
      dueDate: "30. Okt 2024", // Beispiel-Datum
    },
  ];

  // --- Breadcrumb Items ---
  const breadcrumbItems = [{ label: "Dashboard" }];

  // --- JSX ---
  return (
    <div className="p-6 min-h-screen">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Übersicht</h1>
      <p className="text-base text-gray-600 mb-6">
        Willkommen zurück! Hier ist dein Lernfortschritt.
      </p>
      {/* Grid für Statistik-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Module Gesamt"
          value={totalModules}
          icon={<IoLibraryOutline size={24} className="text-dsp-orange" />}
          accentColor="bg-dsp-orange_light"
        />
        <StatCard
          title="Lektionen Gesamt"
          value={totalLessons}
          description={`Ø ${averageLessonsPerModule} pro Modul`}
          icon={<IoSchoolOutline size={24} className="text-dsp-orange" />}
          accentColor="bg-dsp-orange_light"
        />
        <StatCard
          title="Aufgaben Gesamt"
          value={totalTasks}
          description={`Ø ${averageTasksPerModule} pro Modul`}
          icon={<IoListOutline size={24} className="text-dsp-orange" />}
          accentColor="bg-dsp-orange_light"
        />
        <StatCard
          title="Aufgabenverteilung"
          value={`${tasksByDifficulty["Einfach"] || 0} / ${
            tasksByDifficulty["Mittel"] || 0
          } / ${tasksByDifficulty["Schwer"] || 0}`}
          description="Einfach / Mittel / Schwer"
          icon={<IoStatsChartOutline size={24} className="text-dsp-orange" />}
          accentColor="bg-dsp-orange_light"
        />
      </div>
      {/* Grid für weitere Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module nach Schwierigkeit */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          {/* Angepasster Titelbereich */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-dsp-orange_light">
              <BsSpeedometer2 size={20} className="text-dsp-orange" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">
              Module nach Ø Schwierigkeit
            </h2>
          </div>
          <div className="space-y-3">
            {(["Einfach", "Mittel", "Schwer"] as DifficultyLevel[]).map(
              (level) =>
                modulesByAvgDifficulty[level] > 0 && (
                  <div
                    key={level}
                    className="flex items-center justify-between text-sm"
                  >
                    <TagDifficulty difficulty={level} />
                    <span className="font-medium text-gray-800">
                      {modulesByAvgDifficulty[level]} Modul(e)
                    </span>
                  </div>
                )
            )}
            {Object.keys(modulesByAvgDifficulty).length === 0 && (
              <p className="text-sm text-dsp-orange">
                Keine Module mit bewertbaren Aufgaben.
              </p>
            )}
          </div>
        </div>

        {/* Meiste / Wenigste Aufgaben */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          {/* Angepasster Titelbereich */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-dsp-orange_light">
              <IoListOutline size={20} className="text-dsp-orange" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">
              Aufgaben pro Modul
            </h2>
          </div>
          <div className="space-y-3 text-sm">
            {maxTasks > -1 && (
              <div>
                <p className="font-semibold mb-1">
                  Meiste Aufgaben ({maxTasks}):
                </p>
                <p className="text-gray-500">
                  {modulesWithMostTasks.join(", ")}
                </p>
              </div>
            )}
            {minTasks < Infinity && (
              <div className="mt-3">
                <p className="font-semibold mb-1">
                  Wenigste Aufgaben ({minTasks}):
                </p>
                <p className="text-gray-500">
                  {modulesWithLeastTasks.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* --- NEU: Anstehende Fristen --- */}
      {upcomingDeadlines.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Anstehende Fristen
          </h2>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              // Einzelner Frist-Eintrag
              <div
                key={deadline.id}
                className="flex items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
              >
                {/* Icon mit Hintergrund */}
                <div className="p-3 rounded-full bg-dsp-orange_light mr-4 flex-shrink-0">
                  <IoTimeOutline size={20} className="text-dsp-orange" />
                </div>
                {/* Titel, Kontext, Datum */}
                <div className="flex-grow">
                  <p className="text-md font-semibold text-gray-800">
                    {deadline.title}
                  </p>
                  <p className="text-sm text-gray-500">{deadline.context}</p>
                  <p className="text-sm font-medium text-red-600 mt-1">
                    {deadline.dueDate}
                  </p>
                </div>
                {/* Hier könnte später ein Link/Button hin */}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* --- Persönlicher Bereich: Kürzlich bearbeitet --- */}
      {inProgressModules.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Kürzlich bearbeitet
          </h2>
          {/* Container für die Liste mit Transitions */}
          <div
            className={`
              space-y-3 
              overflow-hidden // Behalten für die Animation
              overflow-y-auto // Hinzufügen für Scrollen bei Bedarf
              p-4 // Padding hinzugefügt
              transition-[max-height] duration-700 ease-in-out
              ${
                showAllInProgress ? "max-h-[800px]" : "max-h-80"
              } // Dynamische max-height
            `}
          >
            {/* Immer alle Module rendern, max-height + overflow limitieren die Anzeige */}
            {inProgressModules.map((module) => {
              // Thumbnail Logik
              const firstContent = Array.isArray(module.content)
                ? module.content[0]
                : module.content;
              const videoId = getYouTubeVideoId(firstContent?.videoUrl);
              const thumbnailUrl = videoId
                ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                : null;

              return (
                <Link
                  key={module.id}
                  to={`/modules/${module.id}`}
                  className="flex items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-dsp-orange transition duration-200 ease-in-out group"
                >
                  {/* Thumbnail oder Platzhalter */}
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={`${module.title} thumbnail`}
                      className="w-16 h-10 object-cover rounded mr-4 flex-shrink-0 bg-gray-200" // Hintergrund für Ladezustand
                      onError={(e) => {
                        // Fallback, falls Thumbnail nicht geladen werden kann
                        (e.target as HTMLImageElement).style.display = "none";
                        // Optional: Zeige wieder Platzhalter
                        const placeholder = document.createElement("div");
                        placeholder.className =
                          "w-16 h-10 bg-gray-200 rounded mr-4 flex-shrink-0";
                        (e.target as HTMLImageElement).parentNode?.insertBefore(
                          placeholder,
                          e.target as HTMLImageElement
                        );
                      }}
                    />
                  ) : (
                    <div className="w-16 h-10 bg-gray-200 rounded mr-4 flex-shrink-0"></div>
                  )}

                  {/* Rest der Modul-Info (Titel, Zeit, Fortschritt, Play-Button) */}
                  <div className="flex-grow">
                    <h3 className="text-md font-semibold text-gray-800 group-hover:text-dsp-orange mb-1">
                      {module.title}
                    </h3>
                    <p className="text-xs text-gray-500">Platzhalter Zeit</p>
                  </div>
                  <div className="w-1/3 mx-4 flex items-center flex-shrink-0">
                    {module.progress !== undefined && (
                      <>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mr-3">
                          <div
                            className="bg-dsp-orange h-1.5 rounded-full"
                            style={{ width: `${module.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-10 text-right">
                          {module.progress}%
                        </span>
                      </>
                    )}
                  </div>
                  <IoPlayCircleOutline
                    size={28}
                    className="text-dsp-orange flex-shrink-0"
                  />
                </Link>
              );
            })}
          </div>

          {/* Button zum Auf-/Zuklappen (Logik bleibt gleich) */}
          {inProgressModules.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllInProgress(!showAllInProgress)}
              className="block w-full mt-4 text-center bg-white py-3 px-4 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 text-gray-700 font-medium transition duration-150 ease-in-out"
            >
              {showAllInProgress ? "Weniger anzeigen" : "Mehr anzeigen"}
            </button>
          )}
        </div>
      )}
      {inProgressModules.length === 0 && (
        <div className="mt-12 text-center text-gray-500">
          <p>Du hast aktuell keine Module in Bearbeitung.</p>
          <Link to="/modules" className="text-dsp-orange hover:underline">
            Starte jetzt ein Modul!
          </Link>
        </div>
      )}
    </div>
  );
}

// Hilfskomponente für Statistik-Karten (Props erweitert)
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor?: string; // Optionale Akzentfarbe für Icon-Hintergrund
  description?: string; // Optionale Beschreibung für Zusatzinfos
}
// Korrigierte Komponentendefinition
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  accentColor = "bg-gray-100",
  description,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center gap-4 mb-2">
        <div className={`p-3 rounded-full ${accentColor}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

export default Dashboard;

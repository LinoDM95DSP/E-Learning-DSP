import React, { useState, useEffect, useMemo } from "react";
import Breadcrumbs from "../components/ui_elements/breadcrumbs";
import TagDifficulty from "../components/tags/tag_difficulty";
import * as Icons from "react-icons/io5";
import PopupExamOverview from "../components/pop_ups/popup_exam_overview";
import { useExams, Exam } from "../context/ExamContext";
import api from "../util/apis/api";
import {
  Accordion,
  AccordionItem,
} from "../components/ui_elements/accordions/accordion";
import CardBadge from "../components/cards/card_badge";
import axios from "axios";
import clsx from "clsx";

// --- NEUE INTERFACES basierend auf Backend Serializer ---

interface SimpleExam {
  id: number;
  exam_title: string;
  exam_difficulty: "easy" | "medium" | "hard";
  // Annahme für Frontend-Logik: Beschreibung wird aus allExams geholt
  // exam_description?: string; // Nicht im Backend SimpleExamSerializer
}

// ANNAHME: Backend liefert Module pro Pfad
interface SimpleModule {
  id: number;
  title: string;
  category: string; // Optional, zur Anzeige
  order: number;
}

interface ApiCertificationPath {
  id: number;
  title: string;
  description: string;
  icon: string | null; // Icon-Name als String
  order: number;
  exams: SimpleExam[];
  modules: SimpleModule[]; // Hinzugefügt
}

// --- ICON MAPPING ---

// Hilfsfunktion, um Icon-Namen zu Komponenten zu mappen
const getIconComponent = (
  iconName: string | null | undefined
): React.ElementType => {
  if (iconName && Icons[iconName as keyof typeof Icons]) {
    return Icons[iconName as keyof typeof Icons];
  }
  return Icons.IoSchoolOutline; // Fallback-Icon
};

// --- INHALTS-KOMPONENTEN FÜR DAS AKKORDEON ---

// Komponente für ein Modul-Item innerhalb des Akkordeons
const ModuleListItem: React.FC<{ module: SimpleModule }> = ({ module }) => (
  <li className="py-2 flex items-center space-x-3">
    <span className="flex-shrink-0 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
      {/* Optional: Icon basierend auf Kategorie oder einfach Nummer? */}
      {module.order}
    </span>
    <p className="text-sm font-medium text-gray-700 flex-grow">
      {module.title}
    </p>
    {/* Optional: Kategorie als Badge anzeigen */}
    {module.category && <CardBadge text={module.category} colorScheme="blue" />}
  </li>
);

// Komponente für ein Exam-Item innerhalb des Akkordeons (ähnlich ExamListItem)
const ExamAccordionItem: React.FC<{
  exam: SimpleExam;
  fullExamData: Exam | undefined; // Vollständige Exam-Daten für Beschreibung etc.
  onOpenExamDetails: (examId: number) => void;
  isCompleted: boolean;
  index: number;
}> = ({ exam, fullExamData, onOpenExamDetails, isCompleted, index }) => {
  // Klick-Handler öffnet immer die Details
  const handleCardClick = () => {
    onOpenExamDetails(exam.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={clsx(
        "flex items-center p-4 rounded-lg border mb-2 transition-colors duration-150 ease-in-out",
        // KORREKTUR: cursor-pointer immer, hover nur wenn nicht abgeschlossen
        "cursor-pointer",
        isCompleted
          ? "bg-green-50/60 border-green-200" // Kein Hover-Effekt für abgeschlossene
          : "bg-white border-gray-200 hover:bg-dsp-orange_light"
      )}
      // KORREKTUR: Accessibility immer anwenden
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        // KORREKTUR: Immer auslösen bei Enter/Space
        if (e.key === "Enter" || e.key === " ") {
          handleCardClick();
        }
      }}
    >
      {/* Linke Seite: Kreis */}
      <div className="mr-4 flex-shrink-0">
        <div
          className={clsx(
            "w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold",
            isCompleted
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-600"
          )}
        >
          {isCompleted ? <Icons.IoCheckmark className="w-4 h-4" /> : index + 1}
        </div>
      </div>

      {/* Mittlerer Bereich: Titel, Tag, Beschreibung */}
      <div className="flex-grow min-w-0 mr-4">
        <div className="flex items-center space-x-2 mb-1">
          <p
            className={clsx(
              "text-base font-semibold",
              isCompleted ? "text-gray-600 line-through" : "text-gray-800"
            )}
          >
            {exam.exam_title}
          </p>
          <TagDifficulty
            difficulty={
              exam.exam_difficulty === "easy"
                ? "Einfach"
                : exam.exam_difficulty === "medium"
                ? "Mittel"
                : "Schwer"
            }
          />
        </div>
        <p className="text-sm text-gray-500 truncate">
          {fullExamData?.exam_description || "Keine Beschreibung verfügbar."}
        </p>
      </div>

      {/* KORREKTUR: Rechter Bereich: Details Button immer anzeigen */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Verhindert Klick auf Karte
          onOpenExamDetails(exam.id);
        }}
        className="ml-auto flex-shrink-0 flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 cursor-pointer"
        aria-label={`Details für ${exam.exam_title} anzeigen`}
      >
        Details <Icons.IoArrowForward className="ml-1 w-4 h-4" />
      </button>
    </div>
  );
};

// --- HAUPTKOMPONENTE ---
function CertificationPaths() {
  // Exam Context (für Popup-Details)
  const { allExams, loadingAllExams, errorAllExams, completedExams } =
    useExams();

  // State für Zertifikatspfade
  const [certificationPaths, setCertificationPaths] = useState<
    ApiCertificationPath[]
  >([]);
  const [loadingPaths, setLoadingPaths] = useState<boolean>(true);
  const [errorPaths, setErrorPaths] = useState<string | null>(null);

  // State für das Popup
  const [selectedExamForPopup, setSelectedExamForPopup] = useState<Exam | null>(
    null
  );

  // Kombinierter Lade- und Fehlerstatus (ohne Module Context)
  const isLoading = loadingAllExams || loadingPaths;
  const combinedError = errorPaths || errorAllExams;

  // Abgeschlossene Prüfungs-IDs ermitteln
  const completedExamIds = useMemo(() => {
    // Nutzt completedExams (Typ ExamAttempt[]) aus dem Context
    return new Set(completedExams.map((attempt) => attempt.exam.id));
  }, [completedExams]); // Neu berechnen, wenn sich completedExams ändern

  // Datenabruf für Pfade
  useEffect(() => {
    const fetchPaths = async () => {
      setLoadingPaths(true);
      setErrorPaths(null);
      try {
        const response = await api.get<ApiCertificationPath[]>(
          "/exams/certification-paths/" // Pfad ist bereits korrigiert
        );
        // Sortiere Pfade nach 'order', dann 'title'
        const sortedPaths = (response.data || []).sort(
          (a, b) =>
            (a.order ?? 999) - (b.order ?? 999) ||
            a.title.localeCompare(b.title)
        );
        setCertificationPaths(sortedPaths);
      } catch (err) {
        console.error("Fehler beim Laden der Zertifikatspfade:", err);
        let message = "Zertifikatspfade konnten nicht geladen werden.";

        if (axios.isAxiosError(err)) {
          // Versuche, Details aus dem Axios-Fehler zu extrahieren
          message = err.response?.data?.detail || err.message || message;
        } else if (err instanceof Error) {
          // Standard Error Objekt
          message = err.message;
        } else if (typeof err === "string") {
          // Nur ein String als Fehler?
          message = err;
        }
        // Fallback bleibt die generische Nachricht

        setErrorPaths(message);
      } finally {
        setLoadingPaths(false);
      }
    };

    fetchPaths();
  }, []);

  // --- Handler ---
  const handleOpenExamDetails = (examId: number) => {
    const fullExam = allExams.find((exam) => exam.id === examId);
    if (fullExam) {
      setSelectedExamForPopup(fullExam);
    } else {
      console.warn(
        `Vollständige Exam-Daten für ID ${examId} nicht in allExams gefunden.`
      );
    }
  };

  const handleClosePopup = () => {
    setSelectedExamForPopup(null);
  };

  // Breadcrumbs
  const breadcrumbItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Zertifikatspfade" },
  ];

  // --- Rendering Logik ---

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen flex flex-col items-center justify-center">
        <Icons.IoRefreshOutline className="animate-spin h-12 w-12 text-dsp-orange mb-4" />
        <p className="text-lg text-gray-600">Lade Daten...</p>
      </div>
    );
  }

  if (combinedError) {
    return (
      <div className="p-6 min-h-screen">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Zertifikatspfade
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center">
          <Icons.IoWarningOutline className="h-6 w-6 text-red-500 mr-3" />
          <div>
            <strong className="font-bold">Fehler beim Laden!</strong>
            <span className="block sm:inline">
              {" "}
              {typeof combinedError === "string"
                ? combinedError
                : "Ein unbekannter Fehler ist aufgetreten."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <h1 className="text-3xl font-bold text-gray-800">Zertifikatspfade</h1>
      <p className="text-base text-gray-600 mb-8">
        Entdecke unsere empfohlenen Lernpfade und die zugehörigen
        Abschlussprüfungen.
      </p>

      {certificationPaths.length > 0 ? (
        <Accordion className="">
          {certificationPaths.map((path) => {
            const IconComponent = getIconComponent(path.icon);
            // Sortiere Module und Prüfungen für die Anzeige innerhalb des Accordions
            const sortedModules = (path.modules || [])
              .slice() // Kopie erstellen, um Original nicht zu ändern
              .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
            const sortedExams = (path.exams || [])
              .slice()
              .sort((a, b) => a.exam_title.localeCompare(b.exam_title)); // Sortiere Prüfungen nach Titel

            // --- Fortschrittsberechnung ---
            const totalExams = sortedExams.length;
            const completedExamCount = sortedExams.filter((exam) =>
              completedExamIds.has(exam.id)
            ).length;
            const isPathCompleted =
              totalExams > 0 && completedExamCount === totalExams;

            return (
              <AccordionItem
                key={path.id}
                id={path.id.toString()} // ID muss ein String sein
                title={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      {isPathCompleted && (
                        <Icons.IoCheckmarkCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                      <span>{path.title}</span>
                    </div>
                    {/* Fortschrittsanzeige */}
                    {totalExams > 0 && (
                      <span
                        className={clsx(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          isPathCompleted
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {completedExamCount} / {totalExams} abgeschlossen
                      </span>
                    )}
                  </div>
                }
                icon={IconComponent}
                // Optional: Header-Hintergrund ändern, wenn abgeschlossen
                headerClassName={
                  isPathCompleted ? "bg-green-50 hover:bg-green-100" : ""
                }
              >
                {/* Inhalt des Accordion Items */}
                <p className="text-sm text-gray-600 mb-6">{path.description}</p>

                {/* Benötigte Module */}
                {sortedModules.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-base font-semibold text-gray-700 mb-3">
                      Benötigte Module:
                    </h4>
                    <ul className="space-y-1 list-none pl-0">
                      {sortedModules.map((module) => (
                        <ModuleListItem key={module.id} module={module} />
                      ))}
                    </ul>
                  </div>
                )}

                {/* Abschlussprüfungen */}
                {sortedExams.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-base font-semibold text-gray-700 mb-3">
                      Abschlussprüfungen:
                    </h4>
                    <ul className="list-none p-0 m-0">
                      {sortedExams.map((exam, index) => {
                        // Finde die vollen Exam-Daten für die Beschreibung
                        const fullExam = allExams.find((e) => e.id === exam.id);
                        return (
                          <ExamAccordionItem
                            key={exam.id}
                            exam={exam}
                            fullExamData={fullExam} // Übergebe volle Daten
                            onOpenExamDetails={handleOpenExamDetails}
                            isCompleted={completedExamIds.has(exam.id)}
                            index={index} // index wird jetzt für die Nummer verwendet
                          />
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Fallback, wenn weder Module noch Prüfungen da sind */}
                {sortedModules.length === 0 && sortedExams.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    Für diesen Pfad sind noch keine Module oder Prüfungen
                    definiert.
                  </p>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg border border-gray-200">
          <Icons.IoSchoolOutline className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            Keine Zertifikatspfade gefunden
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Es sind derzeit keine Zertifikatspfade im System definiert.
          </p>
        </div>
      )}

      {/* Popup Rendering */}
      {selectedExamForPopup &&
        (() => {
          // Finde den passenden Attempt für die ausgewählte Prüfung
          const attemptForPopup =
            completedExams.find(
              (att) => att.exam.id === selectedExamForPopup.id
            ) || null; // Fallback auf null, falls kein Attempt gefunden wird

          return (
            <PopupExamOverview
              exam={selectedExamForPopup}
              attempt={attemptForPopup} // Übergebe den gefundenen Attempt
              onClose={handleClosePopup}
              // Wichtig: onStartExam und onPrepareSubmission sind hier nicht relevant,
              // da das Popup von der Zertifikatspfad-Übersicht geöffnet wird,
              // nicht von einer Seite, die diese Aktionen direkt anbietet.
            />
          );
        })()}
    </div>
  );
}

export default CertificationPaths;

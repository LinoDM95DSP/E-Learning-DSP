import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/ui_elements/breadcrumbs";
import ButtonPrimary from "../components/ui_elements/buttons/button_primary";
import ButtonSecondary from "../components/ui_elements/buttons/button_secondary";
import {
  IoTimeOutline,
  IoStarOutline,
  IoCalendarOutline,
  IoFlagOutline,
  IoWarningOutline,
  IoCheckmarkDoneOutline,
  IoCloseOutline,
} from "react-icons/io5";
import ComingSoonOverlay from "../components/messages/coming_soon_overlay";

type TabState = "verfügbar" | "inBearbeitung" | "abgeschlossen";

// --- Platzhalterdaten erweitert ---
const availableExamsPlaceholder = [
  {
    id: "py1",
    title: "Python Abschlussprüfung",
    description: "Erstellen Sie eine Datenanalyse-Anwendung mit Python",
    duration: "48 Stunden",
    difficulty: "Fortgeschritten",
    points: 100,
  },
  {
    id: "ex1",
    title: "Excel Abschlussprüfung",
    description: "Erstellen Sie ein komplexes Finanzmodell mit Excel",
    duration: "24 Stunden",
    difficulty: "Mittel",
    points: 80,
  },
  {
    id: "sql1",
    title: "SQL Datenbankabfragen",
    description: "Komplexe Joins und Subqueries zur Datenextraktion",
    duration: "12 Stunden",
    difficulty: "Mittel",
    points: 60,
  },
  {
    id: "tab1",
    title: "Tableau Visualisierung",
    description: "Erstellen eines interaktiven Dashboards für Verkaufsdaten",
    duration: "36 Stunden",
    difficulty: "Fortgeschritten",
    points: 90,
  },
  {
    id: "ml1",
    title: "Grundlagen des Maschinellen Lernens",
    description: "Anwenden von Klassifikationsalgorithmen auf einen Datensatz",
    duration: "72 Stunden",
    difficulty: "Experte",
    points: 120,
  },
  {
    id: "py2",
    title: "Python für Web Scraping",
    description: "Automatisches Extrahieren von Daten von Webseiten",
    duration: "24 Stunden",
    difficulty: "Mittel",
    points: 70,
  },
  {
    id: "stat1",
    title: "Statistische Analyse mit R",
    description: "Durchführen und Interpretieren von Hypothesentests",
    duration: "48 Stunden",
    difficulty: "Fortgeschritten",
    points: 100,
  },
  {
    id: "cloud1",
    title: "Cloud Computing Grundlagen (AWS)",
    description: "Einrichten einer einfachen Daten-Pipeline in AWS",
    duration: "36 Stunden",
    difficulty: "Mittel",
    points: 85,
  },
  {
    id: "bi1",
    title: "Business Intelligence Konzepte",
    description: "Design eines Data Warehouse Schemas",
    duration: "12 Stunden",
    difficulty: "Mittel",
    points: 50,
  },
  {
    id: "ds1",
    title: "Data Storytelling",
    description:
      "Erstellen einer überzeugenden Präsentation basierend auf Daten",
    duration: "8 Stunden",
    difficulty: "Anfänger",
    points: 40,
  },
];

const inProgressExamsPlaceholder = [
  {
    id: "pbi1",
    title: "Power BI Abschlussprüfung",
    description: "Erstellen Sie ein interaktives Dashboard mit Power BI",
    started: "15. Mai 2023, 14:30",
    deadline: "17. Mai 2023, 14:30",
    remainingTime: "1 Tag, 5 Stunden",
    progress: 60,
  },
  {
    id: "sql2",
    title: "Fortgeschrittene SQL-Optimierung",
    description: "Analysieren und Verbessern der Performance von Abfragen",
    started: "16. Mai 2023, 09:00",
    deadline: "18. Mai 2023, 09:00",
    remainingTime: "2 Tage, 0 Stunden",
    progress: 25,
  },
  {
    id: "py3",
    title: "Python Objektorientierte Programmierung",
    description: "Entwerfen und Implementieren von Klassen für ein Projekt",
    started: "14. Mai 2023, 18:00",
    deadline: "19. Mai 2023, 18:00",
    remainingTime: "4 Tage, 12 Stunden",
    progress: 10,
  },
];

const completedExamsPlaceholder = [
  {
    id: "da1",
    title: "Datenanalyse Abschlussprüfung",
    description:
      "Analysieren Sie einen komplexen Datensatz und präsentieren Sie Ihre Ergebnisse",
    completedDate: "10. April 2023",
    score: "92/100",
    details: {
      processingTime: "45 Stunden",
      allowedTime: "48 Stunden",
      submissionTime: "10. April 2023, 11:15",
      pointsByCategory: [
        { category: "Datenbereinigung", points: "28/30" },
        { category: "Explorative Datenanalyse", points: "35/40" },
        { category: "Visualisierung", points: "15/15" },
        { category: "Präsentation", points: "14/15" },
      ],
      comparisonToAverage: "+12% über Durchschnitt",
    },
  },
  {
    id: "ex2",
    title: "Excel VBA Automatisierung",
    description: "Erstellen eines Makros zur Automatisierung von Berichten",
    completedDate: "05. Mai 2023",
    score: "78/80",
    details: {
      processingTime: "20 Stunden",
      allowedTime: "24 Stunden",
      submissionTime: "05. Mai 2023, 16:45",
      pointsByCategory: [
        { category: "Grundlagen VBA", points: "25/25" },
        { category: "Fehlerbehandlung", points: "18/20" },
        { category: "Benutzerformulare", points: "15/15" },
        { category: "Effizienz", points: "20/20" },
      ],
      comparisonToAverage: "+5% über Durchschnitt",
    },
  },
];

function FinalExam() {
  const [activeTab, setActiveTab] = useState<TabState>("verfügbar");
  const [sliderStyle, setSliderStyle] = useState({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const [expandedDetails, setExpandedDetails] = useState<
    Record<string, boolean>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComment, setSubmissionComment] = useState("");
  const navigate = useNavigate();

  // --- Breadcrumb Items ---
  const breadcrumbItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Abschlussprüfungen" },
  ];

  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;

    const activeButton = container.querySelector<HTMLButtonElement>(
      `[data-tab="${activeTab}"]`
    );
    if (activeButton) {
      setSliderStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [activeTab]);

  const renderTabs = () => (
    <div
      ref={tabsRef}
      className="relative flex space-x-1 border border-gray-300 p-1 rounded-lg bg-gray-100 mb-8 self-start"
    >
      <div
        className="absolute inset-y-0 bg-dsp-orange rounded-md shadow-sm transition-all duration-300 ease-out pointer-events-none"
        style={sliderStyle}
      />
      {(["verfügbar", "inBearbeitung", "abgeschlossen"] as TabState[]).map(
        (tab) => (
          <button
            key={tab}
            data-tab={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative z-10 px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer 
            ${
              activeTab === tab
                ? "text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab === "verfügbar"
              ? "Verfügbar"
              : tab === "inBearbeitung"
              ? "In Bearbeitung"
              : "Abgeschlossen"}
          </button>
        )
      )}
    </div>
  );

  const renderAvailableExams = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableExamsPlaceholder.map((exam) => (
        <div
          key={exam.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200 flex flex-col"
        >
          <div className="p-6 flex-grow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                {exam.title}
              </h3>
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {exam.difficulty}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4 flex-grow">
              {exam.description}
            </p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <IoTimeOutline className="mr-2" /> {exam.duration}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <IoStarOutline className="mr-2" /> {exam.points} Punkte
            </div>
          </div>
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <ButtonPrimary
              title="Prüfung starten"
              classNameButton="w-full text-sm"
              onClick={() => {
                console.log(`Starting exam ${exam.id}`);
                setIsSubmitting(true);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderInProgressExams = () => (
    <div className="space-y-6">
      {inProgressExamsPlaceholder.map((exam) => (
        <div
          key={exam.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200"
        >
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {exam.title}
                </h3>
                <p className="text-sm text-gray-600">{exam.description}</p>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-4 text-sm text-gray-500 flex-shrink-0">
                <div className="flex items-center mb-1">
                  <IoCalendarOutline className="mr-2" /> Gestartet:{" "}
                  {exam.started}
                </div>
                <div className="flex items-center text-red-600 font-medium">
                  <IoFlagOutline className="mr-2" /> Deadline: {exam.deadline}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Fortschritt</span>
                <span>{exam.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-dsp-green h-2 rounded-full"
                  style={{ width: `${exam.progress}%` }}
                ></div>
              </div>
              <div className="text-right text-sm text-gray-500 mt-1">
                <IoTimeOutline className="inline mr-1" /> Verbleibend:{" "}
                {exam.remainingTime}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <ButtonPrimary
                title="Bearbeitung fortsetzen"
                classNameButton="w-full sm:w-auto text-sm"
                onClick={() => console.log(`Resuming exam ${exam.id}`)}
              />
              <ButtonSecondary
                title="Abgabe vorbereiten"
                classNameButton="w-full sm:w-auto text-sm"
                onClick={() => {
                  console.log(`Preparing submission for ${exam.id}`);
                  setIsSubmitting(true);
                }}
              />
              <ButtonSecondary
                icon={<IoWarningOutline />}
                title="Abbrechen (Achtung!) "
                classNameButton="w-full sm:w-auto text-sm text-red-600 border-red-300 hover:bg-red-50"
                onClick={() =>
                  console.log(`Potentially cancelling exam ${exam.id}`)
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const toggleDetails = (examId: string) => {
    setExpandedDetails((prev) => ({ ...prev, [examId]: !prev[examId] }));
  };

  const renderCompletedExams = () => (
    <div className="space-y-4">
      {completedExamsPlaceholder.map((exam) => (
        <div
          key={exam.id}
          className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        >
          <div
            className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleDetails(exam.id)}
          >
            <div className="mb-3 sm:mb-0">
              <h3 className="text-lg font-semibold text-gray-800">
                {exam.title}
              </h3>
              <p className="text-sm text-gray-500">{exam.description}</p>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="flex items-center text-sm text-gray-600">
                <IoCheckmarkDoneOutline className="mr-1 text-green-600" />
                Abgeschlossen: {exam.completedDate}
              </div>
              <div className="text-lg font-semibold text-dsp-blue">
                {exam.score}
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                  expandedDetails[exam.id] ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          {/* Expanded Details Section */}
          {expandedDetails[exam.id] && (
            <div className="border-t border-gray-200 bg-gray-50/50 p-4 sm:p-6">
              <h4 className="text-md font-semibold text-gray-700 mb-3">
                Detailübersicht
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                  <div className="font-medium text-gray-500 mb-1">
                    Bearbeitungszeit
                  </div>
                  <div className="text-gray-800">
                    {exam.details.processingTime} (Erlaubt:{" "}
                    {exam.details.allowedTime})
                  </div>
                </div>
                <div className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                  <div className="font-medium text-gray-500 mb-1">
                    Abgabezeitpunkt
                  </div>
                  <div className="text-gray-800">
                    {exam.details.submissionTime}
                  </div>
                </div>
                <div className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                  <div className="font-medium text-gray-500 mb-1">
                    Vergleich zum Durchschnitt
                  </div>
                  <div
                    className={`font-semibold ${
                      exam.details.comparisonToAverage.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {exam.details.comparisonToAverage}
                  </div>
                </div>
              </div>
              <h4 className="text-md font-semibold text-gray-700 mt-4 mb-3">
                Punkte nach Kategorie
              </h4>
              <div className="space-y-2">
                {exam.details.pointsByCategory.map((cat, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 shadow-sm text-sm"
                  >
                    <span className="text-gray-600">{cat.category}</span>
                    <span className="font-medium text-gray-800">
                      {cat.points}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <ButtonSecondary
                  title="Feedback anfordern"
                  classNameButton="text-sm"
                  onClick={() =>
                    console.log(`Requesting feedback for ${exam.id}`)
                  }
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // --- Overlay Konfiguration ---
  const expectedExamFeatures = [
    "Automatisierte Bewertung mit direktem Feedback",
    "Möglichkeit zur Einreichung von Code-Projekten",
    "Offizielle Zertifikatsausstellung nach Bestehen",
    "Detaillierte Analyse deiner Prüfungsleistung",
  ];

  // Handler für das Schließen des Overlays
  const handleOverlayClose = () => {
    console.log("Exam overlay closed, navigating to dashboard...");
    navigate("/dashboard");
  };

  return (
    <div className="p-6 min-h-screen relative">
      <ComingSoonOverlay
        daysUntilTarget={60}
        expectedFeatures={expectedExamFeatures}
        onClose={handleOverlayClose}
      />
      <div className="opacity-50 pointer-events-none">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        <h1 className="text-3xl font-bold text-gray-800">Abschlussprüfungen</h1>
        <p className="text-base text-gray-600 mb-6">
          Hier findest du alle verfügbaren Abschlussprüfungen und kannst deine
          Prüfungsunterlagen hochladen.
        </p>

        {renderTabs()}

        <div className="mt-6">
          {activeTab === "verfügbar" && renderAvailableExams()}
          {activeTab === "inBearbeitung" && renderInProgressExams()}
          {activeTab === "abgeschlossen" && renderCompletedExams()}
        </div>

        {isSubmitting && (
          <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl z-50 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsSubmitting(false)}
                className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Schließen"
              >
                <IoCloseOutline size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Prüfung abgeben
              </h2>
              <div>
                <label
                  htmlFor="submissionCommentPopup"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kommentar
                </label>
                <textarea
                  id="submissionCommentPopup"
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={submissionComment}
                  onChange={(e) => setSubmissionComment(e.target.value)}
                ></textarea>
              </div>
              <div className="mt-6 flex justify-end">
                <ButtonPrimary
                  title="Absenden"
                  onClick={() => setIsSubmitting(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinalExam;

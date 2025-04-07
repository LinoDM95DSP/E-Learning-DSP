import React, { useState, useRef, useEffect } from "react";
import Breadcrumbs from "../components/ui_elements/breadcrumbs";
import ButtonPrimary from "../components/ui_elements/buttons/button_primary";
import ButtonSecondary from "../components/ui_elements/buttons/button_secondary";
import {
  IoTimeOutline,
  IoStarOutline,
  IoCalendarOutline,
  IoFlagOutline,
  IoWarningOutline,
  IoCloudUploadOutline,
  IoCheckmarkDoneOutline,
  IoSchoolOutline,
  IoAnalyticsOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { BsSpeedometer2 } from "react-icons/bs"; // Reuse for difficulty

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {availableExamsPlaceholder.map((exam) => (
        <div
          key={exam.id}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {exam.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 flex-grow">
            {exam.description}
          </p>
          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <IoTimeOutline className="text-dsp-orange" /> Dauer:{" "}
              {exam.duration}
            </div>
            <div className="flex items-center gap-2">
              <BsSpeedometer2 className="text-dsp-orange" /> Schwierigkeit:{" "}
              {exam.difficulty}
            </div>
            <div className="flex items-center gap-2">
              <IoStarOutline className="text-dsp-orange" /> Punkte:{" "}
              {exam.points}
            </div>
          </div>
          <ButtonPrimary
            title="Prüfung starten"
            classNameButton="w-full justify-center"
            onClick={() => {
              console.log("Start Exam:", exam.id);
            }}
          />
        </div>
      ))}
    </div>
  );

  const renderInProgressExams = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Prüfungskarten Container (ohne Scrollen) */}
      <div className="lg:col-span-2 space-y-6">
        {inProgressExamsPlaceholder.map((exam) => (
          <div
            key={exam.id}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {exam.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 flex-grow">
              {exam.description}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4 border-t border-b border-gray-200 py-4">
              <div className="flex items-center gap-2">
                <IoCalendarOutline className="text-dsp-orange" /> Gestartet am:
                <br />
                {exam.started}
              </div>
              <div className="flex items-center gap-2">
                <IoFlagOutline className="text-dsp-orange" /> Abgabefrist:
                <br />
                {exam.deadline}
              </div>
            </div>
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-md text-sm mb-4 flex items-center gap-2">
              <IoWarningOutline /> Verbleibende Zeit:{" "}
              <span className="font-semibold">{exam.remainingTime}</span>
            </div>
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Fortschritt
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {exam.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-dsp-orange h-2.5 rounded-full transition-width duration-300 ease-in-out"
                  style={{ width: `${exam.progress}%` }}
                ></div>
              </div>
            </div>
            <ButtonPrimary
              title="Prüfung abgeben"
              classNameButton="w-full justify-center mt-auto"
              onClick={() => {
                setIsSubmitting(true);
                setSubmissionComment("");
              }}
            />
          </div>
        ))}
      </div>

      {/* Rechte Spalte für Upload und Hinweise */}
      {!isSubmitting && (
        <div className="lg:col-span-1 space-y-6">
          {/* Datei Upload - self-start entfernt, da es jetzt in einem eigenen space-y Container ist */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 self-start">
              Dateien hochladen
            </h3>
            <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center mb-4">
              <IoCloudUploadOutline size={48} className="text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                Ziehe Dateien hierher oder klicke zum Auswählen
              </p>
              <p className="text-xs text-gray-500">
                Unterstützte Formate: PDF, DOCX, XLSX, PPTX, CSV, PY, IPYNB,
                etc.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ButtonSecondary
                title="Dateien auswählen"
                classNameButton="text-sm"
                onClick={() => {
                  console.log("Select Files");
                }}
              />
              <span className="text-sm text-gray-500">Keine ausgewählt</span>
            </div>
          </div>

          {/* NEU: Hinweise & Regeln */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Hinweise & Regeln zur Abgabe
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              <li>
                Bitte laden Sie alle relevanten Dateien als ZIP-Archiv hoch.
              </li>
              <li>
                Stellen Sie sicher, dass Ihr Code kommentiert und
                nachvollziehbar ist.
              </li>
              <li>
                Die Abgabefrist ist bindend. Verspätete Abgaben werden nicht
                berücksichtigt.
              </li>
              <li>
                Bei technischen Problemen kontaktieren Sie umgehend den Support.
              </li>
              <li>Plagiate führen zur sofortigen Disqualifikation.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const toggleDetails = (examId: string) => {
    setExpandedDetails((prev) => ({ ...prev, [examId]: !prev[examId] }));
  };

  const renderCompletedExams = () => (
    <div className="space-y-4">
      {completedExamsPlaceholder.map((exam) => {
        const isExpanded = expandedDetails[exam.id];
        return (
          <div
            key={exam.id}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {exam.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
              <div className="flex items-start gap-2 text-gray-600">
                <IoCheckmarkDoneOutline
                  size={20}
                  className="text-green-600 flex-shrink-0"
                />
                <div>
                  Abgeschlossen am:
                  <br />
                  {exam.completedDate}
                </div>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <IoSchoolOutline
                  size={20}
                  className="text-blue-600 flex-shrink-0"
                />
                <div>
                  Bewertung:
                  <br />
                  {exam.score}
                </div>
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <IoAnalyticsOutline /> Prüfungsdetails
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {exam.details && (
                    <>
                      <p>
                        <strong>Bearbeitungszeit:</strong>{" "}
                        {exam.details.processingTime} (Erlaubt:{" "}
                        {exam.details.allowedTime})
                      </p>
                      <p>
                        <strong>Abgabezeitpunkt:</strong>{" "}
                        {exam.details.submissionTime}
                      </p>
                      <div>
                        <strong>Punkte nach Kategorie:</strong>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          {exam.details.pointsByCategory.map((p) => (
                            <li key={p.category}>
                              {p.category}: {p.points}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p>
                        <strong>Vergleich zum Durchschnitt:</strong>{" "}
                        {exam.details.comparisonToAverage}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <ButtonSecondary
              title={isExpanded ? "Weniger anzeigen" : "Details anzeigen"}
              classNameButton="w-full justify-center mt-4"
              onClick={() => toggleDetails(exam.id)}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-6 min-h-screen">
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

      {/* NEU: Popup für die Abgabe */}
      {isSubmitting && (
        // Overlay mit Transition für Opacity
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out">
          {/* Popup Container: max-h und overflow-y hinzugefügt */}
          <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl z-50 transition-all duration-300 ease-in-out transform scale-100 opacity-100 max-h-[90vh] overflow-y-auto">
            {/* Schließen Button */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 self-start">
                    Dateien hochladen
                  </h3>
                  <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center mb-4">
                    <IoCloudUploadOutline
                      size={48}
                      className="text-gray-400 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-1">
                      Ziehe Dateien hierher oder klicke zum Auswählen
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX, XLSX, etc.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ButtonSecondary
                      title="Dateien auswählen"
                      classNameButton="text-sm"
                      onClick={() => {
                        console.log("Select Files in Popup");
                      }}
                    />
                    <span className="text-sm text-gray-500">
                      Keine ausgewählt
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="submissionComment"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kommentar zur Abgabe (optional)
                  </label>
                  <textarea
                    id="submissionComment"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-dsp-orange focus:border-dsp-orange sm:text-sm h-32"
                    placeholder="Hier können Sie Anmerkungen für den Prüfer hinterlassen..."
                    value={submissionComment}
                    onChange={(e) => setSubmissionComment(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">
                  Hinweise & Regeln zur Abgabe
                </h3>
                <ul className="space-y-2 text-sm text-blue-700 list-disc list-inside">
                  <li>
                    Bitte laden Sie alle relevanten Dateien als ZIP-Archiv hoch.
                  </li>
                  <li>
                    Stellen Sie sicher, dass Ihr Code kommentiert und
                    nachvollziehbar ist.
                  </li>
                  <li>
                    Die Abgabefrist ist bindend. Verspätete Abgaben werden nicht
                    berücksichtigt.
                  </li>
                  <li>
                    Bei technischen Problemen kontaktieren Sie umgehend den
                    Support.
                  </li>
                  <li>Plagiate führen zur sofortigen Disqualifikation.</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
              <ButtonSecondary
                title="Abbrechen"
                onClick={() => setIsSubmitting(false)}
              />
              <ButtonPrimary
                title="Endgültig absenden"
                onClick={() => {
                  console.log("Submitting with comment:", submissionComment);
                  setIsSubmitting(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinalExam;

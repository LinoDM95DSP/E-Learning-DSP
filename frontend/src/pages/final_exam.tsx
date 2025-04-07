import React, { useState } from "react";
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
} from "react-icons/io5";
import { BsSpeedometer2 } from "react-icons/bs"; // Reuse for difficulty

type TabState = "verfügbar" | "inBearbeitung" | "abgeschlossen";

// --- Platzhalterdaten ---
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
];

const completedExamsPlaceholder = [
  {
    id: "da1",
    title: "Datenanalyse Abschlussprüfung",
    description:
      "Analysieren Sie einen komplexen Datensatz und präsentieren Sie Ihre Ergebnisse",
    completedDate: "10. April 2023",
    score: "92/100",
  },
];

function FinalExam() {
  const [activeTab, setActiveTab] = useState<TabState>("verfügbar");

  // --- Breadcrumb Items ---
  const breadcrumbItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Abschlussprüfungen" },
  ];

  const renderTabs = () => (
    <div className="flex space-x-1 border border-gray-300 p-1 rounded-lg bg-gray-100 mb-8 self-start">
      {(["verfügbar", "inBearbeitung", "abgeschlossen"] as TabState[]).map(
        (tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 
            ${
              activeTab === tab
                ? "bg-dsp-orange text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
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
      {/* Prüfungsdetails */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
        {inProgressExamsPlaceholder.map((exam) => (
          <React.Fragment key={exam.id}>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {exam.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
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
              title="Prüfung fortsetzen"
              classNameButton="w-full justify-center mt-auto"
              onClick={() => {
                console.log("Continue Exam:", exam.id);
              }}
            />
          </React.Fragment>
        ))}
      </div>
      {/* Datei Upload */}
      <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 self-start">
          Dateien hochladen
        </h3>
        <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center mb-4">
          <IoCloudUploadOutline size={48} className="text-gray-400 mb-3" />
          <p className="text-sm text-gray-600 mb-1">
            Ziehe Dateien hierher oder klicke zum Auswählen
          </p>
          <p className="text-xs text-gray-500">
            Unterstützte Formate: PDF, DOCX, XLSX, PPTX, CSV, PY, IPYNB, etc.
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
    </div>
  );

  const renderCompletedExams = () => (
    <div className="space-y-4">
      {completedExamsPlaceholder.map((exam) => (
        <div
          key={exam.id}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {exam.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <IoCheckmarkDoneOutline className="text-green-600" />{" "}
              Abgeschlossen am:
              <br />
              {exam.completedDate}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <IoSchoolOutline className="text-blue-600" /> Bewertung:
              <br />
              {exam.score}
            </div>
          </div>
          <ButtonSecondary
            title="Details anzeigen"
            classNameButton="w-full justify-center"
            onClick={() => {
              console.log("Show Details:", exam.id);
            }}
          />
        </div>
      ))}
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
    </div>
  );
}

export default FinalExam;

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
import { useExams, Exam, ExamAttempt } from "../context/ExamContext";

type TabState = "verfügbar" | "inBearbeitung" | "abgeschlossen";

// Hilfsfunktion zur Berechnung der verbleibenden Tage
const getRemainingTimeText = (remainingDays: number | null): string => {
  if (remainingDays === null) return "Unbekannt";
  if (remainingDays <= 0) return "Fällig";

  const days = Math.floor(remainingDays);
  const hours = Math.round((remainingDays - days) * 24);

  if (days === 0) {
    return `${hours} Stunden`;
  } else if (hours === 0) {
    return `${days} ${days === 1 ? "Tag" : "Tage"}`;
  } else {
    return `${days} ${days === 1 ? "Tag" : "Tage"}, ${hours} Stunden`;
  }
};

// Hilfsfunktion zur Formatierung des Datums
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Nicht verfügbar";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function FinalExam() {
  const [activeTab, setActiveTab] = useState<TabState>("verfügbar");
  const [sliderStyle, setSliderStyle] = useState({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const [expandedDetails, setExpandedDetails] = useState<
    Record<string, boolean>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComment, setSubmissionComment] = useState("");
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(
    null
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  // ExamContext-Daten und Funktionen abrufen
  const {
    availableExams,
    activeExams,
    completedExams,
    loadingUserExams,
    errorUserExams,
    startExam,
    submitExam,
    refreshUserExams,
  } = useExams();

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

  // Tab-Rendering-Funktion
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

  // Funktion zum Starten einer Prüfung
  const handleStartExam = async (examId: number) => {
    console.log(`Starting exam ${examId}`);
    const result = await startExam(examId);
    if (result) {
      setActiveTab("inBearbeitung");
      await refreshUserExams();
    }
  };

  // Funktion zum Abgeben einer Prüfung
  const handleSubmitExam = async () => {
    if (selectedAttemptId !== null) {
      console.log(
        `Submitting exam attempt ${selectedAttemptId} with ${uploadedFiles.length} files`
      );
      const success = await submitExam(selectedAttemptId, uploadedFiles);
      if (success) {
        setIsSubmitting(false);
        setUploadedFiles([]);
        setSubmissionComment("");
        setSelectedAttemptId(null);
        await refreshUserExams();
        setActiveTab("abgeschlossen");
      }
    }
  };

  // Öffnen des Abgabe-Dialogs
  const openSubmissionDialog = (attemptId: number) => {
    setSelectedAttemptId(attemptId);
    setIsSubmitting(true);
  };

  // Datei-Upload-Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  // Verfügbare Prüfungen rendern
  const renderAvailableExams = () => {
    if (loadingUserExams) {
      return <div className="text-center py-8">Lädt Prüfungen...</div>;
    }

    if (errorUserExams) {
      return (
        <div className="text-center py-8 text-red-600">
          Fehler beim Laden der Prüfungen: {errorUserExams}
        </div>
      );
    }

    if (availableExams.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Derzeit sind keine Prüfungen verfügbar.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableExams.map((exam) => (
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
                  {exam.difficulty === "easy"
                    ? "Einfach"
                    : exam.difficulty === "medium"
                    ? "Mittel"
                    : "Schwer"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4 flex-grow">
                {exam.description}
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <IoTimeOutline className="mr-2" /> {exam.duration_weeks}{" "}
                {exam.duration_weeks === 1 ? "Woche" : "Wochen"}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <IoStarOutline className="mr-2" />{" "}
                {exam.criteria.reduce(
                  (sum, criterion) => sum + criterion.max_points,
                  0
                )}{" "}
                Punkte
              </div>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-200">
              <ButtonPrimary
                title="Prüfung starten"
                classNameButton="w-full text-sm"
                onClick={() => handleStartExam(exam.id)}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // In Bearbeitung befindliche Prüfungen rendern
  const renderInProgressExams = () => {
    if (loadingUserExams) {
      return <div className="text-center py-8">Lädt Prüfungen...</div>;
    }

    if (errorUserExams) {
      return (
        <div className="text-center py-8 text-red-600">
          Fehler beim Laden der Prüfungen: {errorUserExams}
        </div>
      );
    }

    if (activeExams.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Du hast derzeit keine Prüfungen in Bearbeitung.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {activeExams.map((attempt) => (
          <div
            key={attempt.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200"
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {attempt.exam.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {attempt.exam.description}
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-4 text-sm text-gray-500 flex-shrink-0">
                  <div className="flex items-center mb-1">
                    <IoCalendarOutline className="mr-2" /> Gestartet:{" "}
                    {formatDate(attempt.started_at)}
                  </div>
                  <div className="flex items-center text-red-600 font-medium">
                    <IoFlagOutline className="mr-2" /> Fällig:{" "}
                    {formatDate(attempt.due_date)}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Zeitlicher Fortschritt</span>
                  <span>
                    {attempt.processing_time_days && attempt.remaining_days
                      ? Math.round(
                          (attempt.processing_time_days /
                            (attempt.processing_time_days +
                              attempt.remaining_days)) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-dsp-green h-2 rounded-full"
                    style={{
                      width: `${
                        attempt.processing_time_days && attempt.remaining_days
                          ? Math.round(
                              (attempt.processing_time_days /
                                (attempt.processing_time_days +
                                  attempt.remaining_days)) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">
                  <IoTimeOutline className="inline mr-1" /> Verbleibend:{" "}
                  {getRemainingTimeText(attempt.remaining_days)}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <ButtonPrimary
                  title="Bearbeitung fortsetzen"
                  classNameButton="w-full sm:w-auto text-sm"
                  onClick={() => console.log(`Resuming exam ${attempt.id}`)}
                />
                <ButtonSecondary
                  title="Abgabe vorbereiten"
                  classNameButton="w-full sm:w-auto text-sm"
                  onClick={() => openSubmissionDialog(attempt.id)}
                />
                <ButtonSecondary
                  icon={<IoWarningOutline />}
                  title="Abbrechen (Achtung!) "
                  classNameButton="w-full sm:w-auto text-sm text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() =>
                    console.log(`Potentially cancelling exam ${attempt.id}`)
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Toggle für Detailanzeige
  const toggleDetails = (examId: string) => {
    setExpandedDetails((prev) => ({ ...prev, [examId]: !prev[examId] }));
  };

  // Abgeschlossene Prüfungen rendern
  const renderCompletedExams = () => {
    if (loadingUserExams) {
      return <div className="text-center py-8">Lädt Prüfungen...</div>;
    }

    if (errorUserExams) {
      return (
        <div className="text-center py-8 text-red-600">
          Fehler beim Laden der Prüfungen: {errorUserExams}
        </div>
      );
    }

    if (completedExams.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Du hast noch keine Prüfungen abgeschlossen.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {completedExams.map((attempt) => (
          <div
            key={attempt.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            <div
              className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleDetails(attempt.id.toString())}
            >
              <div className="mb-3 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-800">
                  {attempt.exam.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {attempt.exam.description}
                </p>
              </div>
              <div className="flex items-center space-x-4 flex-shrink-0">
                <div className="flex items-center text-sm text-gray-600">
                  <IoCheckmarkDoneOutline className="mr-1 text-green-600" />
                  {attempt.status === "graded"
                    ? "Bewertet: " +
                      (attempt.graded_at
                        ? formatDate(attempt.graded_at)
                        : "Unbekannt")
                    : "Abgegeben: " +
                      (attempt.submitted_at
                        ? formatDate(attempt.submitted_at)
                        : "Unbekannt")}
                </div>
                {attempt.score !== null && (
                  <div className="text-lg font-semibold text-dsp-blue">
                    {attempt.score}/
                    {attempt.exam.criteria.reduce(
                      (sum, criterion) => sum + criterion.max_points,
                      0
                    )}
                  </div>
                )}
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                    expandedDetails[attempt.id.toString()] ? "rotate-180" : ""
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
            {expandedDetails[attempt.id.toString()] && (
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
                      {attempt.processing_time_days
                        ? `${attempt.processing_time_days} ${
                            attempt.processing_time_days === 1 ? "Tag" : "Tage"
                          }`
                        : "Unbekannt"}
                      (Erlaubt: {attempt.exam.duration_weeks}{" "}
                      {attempt.exam.duration_weeks === 1 ? "Woche" : "Wochen"})
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                    <div className="font-medium text-gray-500 mb-1">
                      Abgabezeitpunkt
                    </div>
                    <div className="text-gray-800">
                      {attempt.submitted_at
                        ? formatDate(attempt.submitted_at)
                        : "Unbekannt"}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                    <div className="font-medium text-gray-500 mb-1">Status</div>
                    <div className="font-semibold text-gray-800">
                      {attempt.status === "graded"
                        ? "Bewertet"
                        : attempt.status === "submitted"
                        ? "Abgegeben"
                        : "In Bearbeitung"}
                    </div>
                  </div>
                </div>

                {attempt.criterion_scores &&
                  attempt.criterion_scores.length > 0 && (
                    <>
                      <h4 className="text-md font-semibold text-gray-700 mt-4 mb-3">
                        Punkte nach Kriterium
                      </h4>
                      <div className="space-y-2">
                        {attempt.criterion_scores.map((score) => (
                          <div
                            key={score.id}
                            className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 shadow-sm text-sm"
                          >
                            <span className="text-gray-600">
                              {score.criterion.title}
                            </span>
                            <span className="font-medium text-gray-800">
                              {score.achieved_points}/
                              {score.criterion.max_points}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                {attempt.feedback && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">
                      Feedback
                    </h4>
                    <div className="bg-white p-3 rounded border border-gray-100 shadow-sm text-gray-800 text-sm">
                      {attempt.feedback}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <ButtonSecondary
                    title="Feedback anfordern"
                    classNameButton="text-sm"
                    onClick={() =>
                      console.log(`Requesting feedback for ${attempt.id}`)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen">
      <div>
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
              <div className="mb-6">
                <label
                  htmlFor="fileUpload"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Dateien hochladen
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    {uploadedFiles.length}{" "}
                    {uploadedFiles.length === 1 ? "Datei" : "Dateien"}{" "}
                    ausgewählt
                  </div>
                )}
              </div>
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
              <div className="mt-6 flex justify-end space-x-3">
                <ButtonSecondary
                  title="Abbrechen"
                  onClick={() => setIsSubmitting(false)}
                />
                <ButtonPrimary title="Absenden" onClick={handleSubmitExam} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinalExam;

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IoSearchOutline,
  IoFilterOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoDocumentTextOutline,
  IoCodeSlashOutline,
  IoServerOutline, // Beispiel für CSV/Datenbank
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoHourglassOutline,
  IoArrowBackOutline, // Neu für Zurück-Button
  IoDownloadOutline, // Neu für Herunterladen
  IoSaveOutline, // Neu für Speichern-Button
  IoContractOutline,
  IoExpandOutline,
} from "react-icons/io5";
import ButtonPrimary from "../components/ui_elements/buttons/button_primary";
// NEU: ExamContext importieren
import {
  useExams,
  ExamAttempt as ContextExamAttempt, // Importiere als ContextExamAttempt, um Konflikt zu vermeiden
  // Criterion, // Entfernt, da nicht direkt verwendet
  // ExamAttachment wird lokal definiert
} from "../context/ExamContext";
import LoadingSpinner from "../components/ui_elements/loading_spinner"; // Import LoadingSpinner

// --- Lokale Typdefinitionen (da nicht im Context exportiert) --- //

// Lokaler Typ für Anhänge (basierend auf erwarteter Struktur)
interface ExamAttachment {
  id: number;
  file: string; // URL zur Datei
  file_type: "pdf" | "csv" | "py" | "db" | "other"; // Abgeleiteter Dateityp
  uploaded_at?: string; // Optional
}

// Erweitere den ExamAttempt-Typ lokal, um attachments einzuschließen
interface ExamAttempt extends ContextExamAttempt {
  attachments?: ExamAttachment[];
  exam: ContextExamAttempt["exam"] & { total_max_points?: number }; // Füge total_max_points hinzu
}

// --- Hilfskomponenten --- //

// Dateityp-Icons (Beibehaltung der Logik, Anpassung an ExamAttachment.file_type)
const getFileType = (filename: string): ExamAttachment["file_type"] => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "pdf";
    case "csv":
      return "csv";
    case "py":
      return "py";
    case "db":
      return "db";
    // Fügen Sie hier weitere Typen hinzu, falls erforderlich
    default:
      return "other";
  }
};

const FileIcon: React.FC<{ type: ExamAttachment["file_type"] }> = ({
  type,
}) => {
  switch (type) {
    case "pdf":
      return <IoDocumentTextOutline className="text-red-500 mr-1 shrink-0" />;
    case "csv":
      return <IoServerOutline className="text-green-500 mr-1 shrink-0" />;
    case "py":
      return <IoCodeSlashOutline className="text-blue-500 mr-1 shrink-0" />;
    // case "db": // Icon für Datenbank hinzufügen, falls benötigt
    //   return <IoServerOutline className="text-purple-500 mr-1 shrink-0" />;
    default:
      return <IoDocumentTextOutline className="text-gray-500 mr-1 shrink-0" />;
  }
};

// Status Badge (Anpassung an ExamAttempt.status)
const StatusBadge: React.FC<{ status: ExamAttempt["status"] }> = ({
  status,
}) => {
  let bgColor, textColor, Icon, text;
  switch (status) {
    case "started": // Status 'started' hinzugefügt (obwohl hier unwahrscheinlich)
      bgColor = "bg-orange-100";
      textColor = "text-orange-700";
      Icon = IoHourglassOutline;
      text = "Gestartet";
      break;
    case "submitted": // 'pending' durch 'submitted' ersetzt
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-700";
      Icon = IoAlertCircleOutline;
      text = "Eingereicht"; // Text angepasst
      break;
    case "graded":
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      Icon = IoCheckmarkCircle;
      text = "Bewertet";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-700";
      Icon = IoAlertCircleOutline;
      text = "Unbekannt";
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} whitespace-nowrap`}
    >
      <Icon className="mr-1" />
      {text}
    </span>
  );
};

// Hilfsfunktion zum Formatieren von Daten (optional, falls benötigt)
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  try {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  } catch (e) {
    console.error("Error formatting date:", e); // Fehler loggen
    return "Ungültiges Datum";
  }
};

// --- Detailansicht Komponente (Angepasst für ExamAttempt) --- //
interface ExamReviewDetailProps {
  attempt: ExamAttempt;
  onBackToList: () => void;
}

const ExamReviewDetail: React.FC<ExamReviewDetailProps> = ({
  attempt,
  onBackToList,
}) => {
  const { gradeExam, refreshTeacherData } = useExams(); // gradeExam und refreshTeacherData aus dem Context holen
  const [isGrading, setIsGrading] = useState(false); // Ladezustand für die Bewertung

  // State für Bewertungen und Feedback
  // Initialisiere 'scores' basierend auf den Kriterien der Prüfung
  const initialScores = attempt.exam.criteria.reduce(
    (acc, criterion) => {
      // Finde den vorhandenen Score für dieses Kriterium, falls vorhanden
      const existingScore = attempt.criterion_scores?.find(
        (s) => s.criterion.id === criterion.id
      );
      acc[criterion.id] = existingScore
        ? // Konvertiere DecimalField (String) zu number
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parseFloat(existingScore.achieved_points as any) // Explizites any unterdrückt, da Typ aus API kommt
        : ""; // Leerer String, wenn noch nicht bewertet
      return acc;
    },
    {} as Record<number, number | string> // Key ist criterion.id
  );

  const [scores, setScores] =
    useState<Record<number, number | string>>(initialScores);
  const [feedback, setFeedback] = useState(attempt.feedback || "");

  // NEU: State und Ref für Vollbild
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Dynamische maxScores basierend auf Kriterien
  const maxScores = attempt.exam.criteria.reduce((acc, criterion) => {
    acc[criterion.id] = criterion.max_points;
    return acc;
  }, {} as Record<number, number>);

  const handleScoreChange = (criterionId: number, value: string) => {
    const numValue = value === "" ? "" : parseFloat(value); // parseFloat verwenden
    const max = maxScores[criterionId];

    if (typeof numValue === "number" && !isNaN(numValue)) {
      // Prüfe auch auf NaN
      if (max !== undefined && numValue > max) {
        setScores((prev) => ({ ...prev, [criterionId]: max }));
      } else if (numValue < 0) {
        setScores((prev) => ({ ...prev, [criterionId]: 0 }));
      } else {
        // Erlaube Dezimalzahlen mit bis zu 2 Nachkommastellen
        const roundedValue = Math.round(numValue * 100) / 100;
        setScores((prev) => ({ ...prev, [criterionId]: roundedValue }));
      }
    } else {
      // Erlaube leeren String
      setScores((prev) => ({ ...prev, [criterionId]: "" }));
    }
  };

  const handleSaveReview = async () => {
    setIsGrading(true);
    console.log("Bewertung speichern:", {
      attemptId: attempt.id,
      scores,
      feedback,
    });

    // Scores in das erforderliche Format konvertieren
    const formattedScores = Object.entries(scores)
      .map(([criterionIdStr, achievedPoints]) => {
        const points = parseFloat(achievedPoints.toString());
        // Prüfe, ob der Wert eine gültige Zahl ist (nicht NaN und nicht leerer String interpretiert als 0)
        if (achievedPoints === "" || isNaN(points)) {
          return null; // Ungültige oder fehlende Eingabe ignorieren
        }
        return {
          criterion_id: parseInt(criterionIdStr),
          achieved_points: points,
        };
      })
      .filter(
        (item): item is { criterion_id: number; achieved_points: number } =>
          item !== null
      ); // Filter null Werte

    // Prüfen, ob alle Kriterien bewertet wurden
    const allCriteriaIds = attempt.exam.criteria.map((c) => c.id);
    const scoredCriteriaIds = formattedScores.map((s) => s.criterion_id);
    const missingCriteria = allCriteriaIds.filter(
      (id) => !scoredCriteriaIds.includes(id)
    );

    if (missingCriteria.length > 0) {
      alert(
        `Bitte bewerten Sie alle Kriterien. Fehlend: ${missingCriteria.join(
          ", "
        )}`
      );
      setIsGrading(false);
      return;
    }

    try {
      const success = await gradeExam(attempt.id, formattedScores, feedback);
      if (success) {
        alert("Bewertung erfolgreich gespeichert!");
        await refreshTeacherData(); // Daten neu laden
        // Optional: Zurück zur Liste navigieren oder Ansicht aktualisieren
        onBackToList();
      } else {
        alert("Fehler beim Speichern der Bewertung.");
      }
    } catch (error) {
      console.error("Fehler beim Speichern der Bewertung:", error);
      alert("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsGrading(false);
    }
  };

  // Berechnung der Gesamtpunktzahl (Linter-Fehler behoben)
  const maxTotalScore = attempt.exam.criteria.reduce(
    (sum, criterion) => sum + criterion.max_points,
    0
  );

  // Konvertiere scores zu Zahlen *bevor* reduce aufgerufen wird
  const numericScores = Object.values(scores).map((score) => {
    const num = parseFloat(score.toString());
    return isNaN(num) ? 0 : num;
  });

  const totalScore = numericScores.reduce((sum, numScore) => sum + numScore, 0);

  const totalPercentage =
    maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

  // State für aktive Datei (Anhänge)
  const [activeAttachment, setActiveAttachment] =
    useState<ExamAttachment | null>(attempt.attachments?.[0] || null); // Linter-Fehler behoben (lokale Typdefinition)

  // NEU: Funktion zum Umschalten des Vollbildmodus
  const toggleFullscreen = async () => {
    const elem = previewRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      try {
        await elem.requestFullscreen();
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
        } else {
          console.error("An unknown error occurred while entering fullscreen");
        }
      }
    } else {
      if (document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(
              `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
            );
          } else {
            console.error("An unknown error occurred while exiting fullscreen");
          }
        }
      }
    }
  };

  // NEU: Effekt zum Überwachen des Vollbildstatus
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Cleanup-Funktion
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []); // Leeres Abhängigkeitsarray, läuft nur beim Mounten/Unmounten

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md p-4 sm:p-6"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <button
          onClick={onBackToList}
          className="flex items-center text-sm text-gray-600 hover:text-dsp-orange bg-white px-3 py-1.5 rounded-md border border-gray-300 shadow-sm whitespace-nowrap"
        >
          <IoArrowBackOutline className="mr-1.5" />
          Zurück zur Übersicht
        </button>
        <div className="flex items-center space-x-2 flex-wrap justify-end ">
          <StatusBadge status={attempt.status} />
          {/* Fälligkeitsdatum (aus attempt.due_date) */}
          {attempt.due_date && (
            <div className="text-sm text-gray-500 whitespace-nowrap">
              Fällig: {formatDate(attempt.due_date)}
            </div>
          )}
        </div>
      </div>
      <div className="mb-6 border-b pb-4">
        {/* Titel und Student/Modul aus attempt */}
        <h2 className="text-xl font-semibold text-gray-800">
          {attempt.exam.title}
        </h2>
        <p className="text-sm text-gray-600">
          Student: {attempt.user.username} | Modul:{" "}
          {attempt.exam.modules?.map((m) => m.title).join(", ") || "N/A"}
        </p>
      </div>

      {/* Hauptbereich */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Linke Spalte: Dokumente (Anhänge) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Eingereichte Dokumente
          </h3>
          {attempt.attachments && attempt.attachments.length > 0 ? (
            <>
              <div className="flex space-x-1 border-b mb-4 overflow-x-auto pb-px -mx-4 sm:-mx-6 px-4 sm:px-6">
                {attempt.attachments.map(
                  (
                    attachment: ExamAttachment // Typ explizit hinzugefügt
                  ) => (
                    <button
                      key={attachment.id}
                      onClick={() => setActiveAttachment(attachment)}
                      className={`flex items-center px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-150 shrink-0 ${
                        activeAttachment?.id === attachment.id
                          ? "border-dsp-orange text-dsp-orange"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <FileIcon type={getFileType(attachment.file)} />{" "}
                      {/* Dateinamen extrahieren */}
                      <span className="truncate max-w-[150px] sm:max-w-[200px]">
                        {attachment.file.split("/").pop() || attachment.file}
                      </span>
                    </button>
                  )
                )}
              </div>
              {/* Vorschau-Bereich mit Ref */}
              <div
                ref={previewRef} // Ref hier hinzugefügt
                className="bg-gray-50 rounded-md p-6 min-h-[400px] flex flex-col justify-center items-center text-center border border-gray-200 relative group"
                style={{ backgroundColor: isFullscreen ? "white" : undefined }}
              >
                {activeAttachment ? (
                  <>
                    <FileIcon type={getFileType(activeAttachment.file)} />
                    <p className="font-medium text-gray-700 mb-1 mt-2">
                      Vorschau nicht verfügbar{" "}
                      {/* Vorschau ist komplex, daher Platzhalter */}
                    </p>
                    <p className="text-sm text-gray-500 mb-6 break-all">
                      {activeAttachment.file.split("/").pop() ||
                        activeAttachment.file}
                    </p>
                    <div className="flex space-x-3">
                      {/* Vollbild-Button (hier nur für den Container) */}
                      <button
                        onClick={toggleFullscreen}
                        className="flex items-center text-sm bg-white border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50 shadow-sm"
                      >
                        {isFullscreen ? (
                          <IoContractOutline className="mr-1.5" />
                        ) : (
                          <IoExpandOutline className="mr-1.5" />
                        )}
                        {isFullscreen ? "Vollbild verlassen" : "Vollbild"}
                      </button>
                      {/* Download-Link */}
                      <a
                        href={activeAttachment.file} // Direkt auf die Datei-URL verlinken
                        download // Attribut für Download
                        target="_blank" // In neuem Tab öffnen (optional)
                        rel="noopener noreferrer"
                        className="flex items-center text-sm bg-white border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50 shadow-sm"
                      >
                        <IoDownloadOutline className="mr-1.5" /> Herunterladen
                      </a>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">Keine Datei ausgewählt.</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500">Keine Dokumente eingereicht.</p>
          )}
        </div>

        {/* Rechte Spalte: Bewertung */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Bewertung
            </h3>
            <div className="space-y-4">
              {/* Dynamische Bewertungsfelder basierend auf Kriterien */}
              {attempt.exam.criteria.map((criterion) => {
                const criterionId = criterion.id;
                const max = maxScores[criterionId];
                const currentScore = scores[criterionId] ?? "";
                const percentage =
                  max > 0 &&
                  typeof currentScore === "number" &&
                  currentScore >= 0 // Sicherstellen, dass currentScore eine Zahl ist
                    ? Math.round((currentScore / max) * 100)
                    : 0;

                return (
                  <div key={criterionId}>
                    <label
                      htmlFor={`criterion-${criterionId}`}
                      className="block text-sm font-medium text-gray-600 mb-1.5"
                    >
                      {criterion.title}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        id={`criterion-${criterionId}`}
                        name={`criterion-${criterionId}`}
                        value={currentScore}
                        onChange={(e) =>
                          handleScoreChange(criterionId, e.target.value)
                        }
                        min="0"
                        max={max}
                        step="0.01" // Erlaube Dezimalzahlen
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-dsp-orange focus:border-dsp-orange shadow-sm" // Breite angepasst
                        placeholder="0"
                        // Deaktiviert, wenn bereits bewertet? Oder schreibgeschützt?
                        // disabled={attempt.status === 'graded'}
                      />
                      <div className="flex-grow bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage > 0 ? "bg-dsp-orange" : "bg-transparent"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-16 text-right shrink-0">
                        {" "}
                        {/* Breite angepasst */}
                        Max: {max}
                      </span>
                      <span className="text-xs font-medium text-gray-700 w-10 text-right shrink-0">
                        {" "}
                        {/* Breite angepasst */}
                        {percentage}%
                      </span>
                    </div>
                    {criterion.description && (
                      <p className="text-xs text-gray-500 mt-1 ml-22">
                        {" "}
                        {/* Einrückung für Beschreibung */}
                        {criterion.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-semibold text-gray-700">
                  Gesamtpunktzahl
                </span>
                <span className="text-sm font-bold text-dsp-orange">
                  {totalScore.toFixed(2)} / {maxTotalScore.toFixed(2)} Punkte
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    totalPercentage > 0 ? "bg-dsp-orange" : "bg-transparent"
                  }`}
                  style={{ width: `${totalPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-700 block text-right mt-1">
                {totalPercentage}%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Kommentare & Feedback
            </h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-dsp-orange focus:border-dsp-orange shadow-sm mb-3" // Margin Bottom hinzugefügt
              placeholder="Geben Sie hier Ihr Feedback ein..."
              // disabled={attempt.status === 'graded'}
            />
            <ButtonPrimary
              title={isGrading ? "Speichern..." : "Bewertung abschließen"}
              onClick={handleSaveReview}
              icon={<IoSaveOutline className="mr-1.5" />}
              disabled={isGrading || attempt.status === "graded"} // Deaktiviert während Speichern oder wenn bereits bewertet
              classNameButton="w-full" // Volle Breite
            />
            {attempt.status === "graded" && (
              <p className="text-sm text-green-600 mt-2 text-center">
                Diese Prüfung wurde bereits bewertet.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Hauptkomponente (Angepasst für ExamContext) --- //
const AdminPanelExamReviewSection: React.FC = () => {
  const {
    teacherSubmissions,
    loadingTeacherData,
    errorTeacherData,
    refreshTeacherData,
  } = useExams();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState<ExamAttempt["status"] | "all">(
    "all"
  );
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(
    null
  );

  // Daten neu laden, wenn die Komponente montiert wird
  useEffect(() => {
    refreshTeacherData();
  }, [refreshTeacherData]); // Abhängigkeit hinzugefügt

  // Filtern der Prüfungen (Angepasst für teacherSubmissions)
  const filteredAttempts = (teacherSubmissions as ExamAttempt[]).filter(
    (attempt) => {
      // Type assertion
      const lowerSearchTerm = searchTerm.toLowerCase();
      const searchMatch =
        attempt.exam.title.toLowerCase().includes(lowerSearchTerm) ||
        attempt.user.username.toLowerCase().includes(lowerSearchTerm) ||
        attempt.exam.modules
          ?.map((m) => m.title.toLowerCase())
          .join(" ")
          .includes(lowerSearchTerm);

      const filterMatch =
        filterValue === "all" || attempt.status === filterValue;
      return searchMatch && filterMatch;
    }
  );

  const handleSelectAttempt = (attemptId: number) => {
    setSelectedAttemptId(attemptId);
    window.scrollTo(0, 0); // Nach oben scrollen beim Wechsel zur Detailansicht
  };

  const handleBackToList = () => {
    setSelectedAttemptId(null);
  };

  // Finde das ausgewählte Attempt-Objekt
  const selectedAttempt =
    selectedAttemptId !== null
      ? (teacherSubmissions as ExamAttempt[]).find(
          (attempt) => attempt.id === selectedAttemptId
        ) // Type assertion
      : null;

  return (
    // Container für beide Ansichten (Liste oder Detail)
    <div>
      {selectedAttempt ? (
        // --- Detailansicht ---
        <ExamReviewDetail
          attempt={selectedAttempt}
          onBackToList={handleBackToList}
        />
      ) : (
        // --- Listenansicht ---
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Such- und Filterleiste */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Suche nach Titel, Modul oder Student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-dsp-orange focus:border-transparent"
              />
              <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={filterValue}
                onChange={(e) =>
                  setFilterValue(
                    e.target.value as ExamAttempt["status"] | "all"
                  )
                }
                className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-dsp-orange focus:border-dsp-orange shadow-sm"
              >
                {/* Filteroptionen angepasst */}
                <option value="all">
                  Alle anzeigen ({teacherSubmissions.length})
                </option>
                <option value="submitted">
                  Eingereicht (
                  {
                    (teacherSubmissions as ExamAttempt[]).filter(
                      // Type assertion
                      (a) => a.status === "submitted"
                    ).length
                  }
                  )
                </option>
                <option value="graded">
                  Bewertet (
                  {
                    (teacherSubmissions as ExamAttempt[]).filter(
                      // Type assertion
                      (a) => a.status === "graded"
                    ).length
                  }
                  )
                </option>
                {/* Ggf. 'started' hinzufügen, falls relevant */}
              </select>
              <IoFilterOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Liste der Prüfungen */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 ">
              Eingereichte Abschlussprüfungen
            </h3>
            {loadingTeacherData && (
              <div className="text-center py-6">
                <LoadingSpinner /> Lädt Einreichungen...
              </div>
            )}
            {errorTeacherData && (
              <p className="text-center text-red-600 py-6">
                Fehler beim Laden: {errorTeacherData}
              </p>
            )}
            {!loadingTeacherData && !errorTeacherData && (
              <div className="space-y-4">
                {filteredAttempts.length > 0 ? (
                  filteredAttempts.map((attempt) => {
                    // Border Color Logic anpassen
                    let borderColorClass = "border-transparent";
                    if (attempt.status === "submitted")
                      borderColorClass = "border-yellow-400";
                    else if (attempt.status === "graded")
                      borderColorClass = "border-green-400";

                    return (
                      <div
                        key={attempt.id}
                        className={`bg-white rounded-lg shadow-sm border-l-4 ${borderColorClass} p-4 sm:p-6 ring-1 ring-gray-200`}
                      >
                        {/* Obere Reihe */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                          <h4 className="text-lg font-semibold text-gray-800 mb-1 sm:mb-0">
                            {attempt.exam.title}
                          </h4>
                          <div className="flex items-center space-x-2 flex-wrap justify-end">
                            <StatusBadge status={attempt.status} />
                            {/* Priority Badge entfernt, da nicht im Model */}
                          </div>
                        </div>
                        {/* Studenten Info */}
                        <div className="text-sm text-gray-600 mb-3">
                          <span>{attempt.user.username}</span>
                          <span className="mx-2">|</span>
                          <span>
                            {attempt.exam.modules
                              ?.map((m) => m.title)
                              .join(", ") || "N/A"}
                          </span>
                        </div>
                        {/* Mittlerer Bereich (Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Linke Spalte */}
                          <div>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <IoCalendarOutline className="mr-1.5" />
                              Eingereicht: {formatDate(attempt.submitted_at)}
                            </div>
                            <div className="text-sm text-gray-700 font-medium mb-1">
                              Dateien:
                            </div>
                            {attempt.attachments &&
                            attempt.attachments.length > 0 ? (
                              <ul className="space-y-1">
                                {attempt.attachments.map((attachment) => (
                                  <li
                                    key={attachment.id}
                                    className="flex items-center text-sm text-gray-600 hover:text-dsp-orange cursor-pointer"
                                    // Optional: onClick zum Öffnen/Herunterladen
                                    onClick={() =>
                                      window.open(attachment.file, "_blank")
                                    }
                                  >
                                    <FileIcon
                                      type={getFileType(attachment.file)}
                                    />
                                    <span className="truncate">
                                      {attachment.file.split("/").pop() ||
                                        attachment.file}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">
                                Keine Dateien
                              </p>
                            )}
                          </div>
                          {/* Rechte Spalte (Frist und Fortschritt - ggf. anpassen) */}
                          <div>
                            {/* Bewertungsfrist (falls vorhanden und relevant) */}
                            {attempt.due_date && (
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <IoTimeOutline className="mr-1.5" />
                                Fällig am: {formatDate(attempt.due_date)}
                              </div>
                            )}
                            {/* Bewertungsfortschritt (Platzhalter oder entfernen) */}
                            {/* <div className="mb-1"> ... </div> */}
                            {attempt.status === "graded" && attempt.score && (
                              <div className="text-sm text-gray-700 font-medium">
                                Ergebnis:{" "}
                                {(typeof attempt.score === "number"
                                  ? attempt.score
                                  : parseFloat(attempt.score || "0")
                                ).toFixed(2)}{" "}
                                /{" "}
                                {attempt.exam.total_max_points?.toFixed(2) ||
                                  "?"}{" "}
                                Punkte
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Untere Reihe */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-200 pt-4 mt-4">
                          <div className="flex items-center text-sm text-gray-500 mb-3 sm:mb-0">
                            {attempt.status === "submitted" && (
                              <IoAlertCircleOutline className="mr-1.5 text-yellow-500" />
                            )}
                            {attempt.status === "graded" && (
                              <IoCheckmarkCircle className="mr-1.5 text-green-500" />
                            )}
                            {attempt.status === "submitted" &&
                              "Prüfung erwartet Bewertung"}
                            {attempt.status === "graded" &&
                              `Bewertet am ${formatDate(attempt.graded_at)}`}
                          </div>
                          {attempt.status === "submitted" && (
                            <ButtonPrimary
                              title="Jetzt bewerten"
                              onClick={() => handleSelectAttempt(attempt.id)}
                            />
                          )}
                          {attempt.status === "graded" && (
                            <ButtonPrimary // Oder ButtonSecondary für "Details anzeigen"
                              title="Bewertung ansehen"
                              onClick={() => handleSelectAttempt(attempt.id)}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500 py-6">
                    Keine Einreichungen gefunden, die den Kriterien entsprechen.
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPanelExamReviewSection;

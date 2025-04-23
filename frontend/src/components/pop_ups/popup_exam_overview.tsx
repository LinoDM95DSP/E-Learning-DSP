import React from "react";
import { motion } from "framer-motion";
import {
  IoCloseOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoFlagOutline,
  IoCheckmarkCircleOutline,
  IoChatbubbleEllipsesOutline,
  IoStatsChartOutline,
  IoDocumentTextOutline,
  IoListOutline,
  IoCheckmarkDoneOutline,
  IoTimerOutline,
  IoRocketOutline,
} from "react-icons/io5";
import {
  Clock,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Timer,
  ListChecks,
  FileText,
  Award,
  ChevronRight,
  X,
  Info,
} from "lucide-react";
import { Exam, ExamAttempt, Criterion } from "../../context/ExamContext"; // Pfad anpassen, falls nötig
import ButtonPrimary from "../ui_elements/buttons/button_primary";
import ButtonSecondary from "../ui_elements/buttons/button_secondary";

// Hilfsfunktionen (ggf. auslagern oder importieren)
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getRemainingTimeText = (
  remainingDays: number | null | undefined
): string => {
  if (remainingDays === null || remainingDays === undefined) return "N/A";
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

const getDifficultyLabel = (difficulty: string | undefined): string => {
  switch (difficulty) {
    case "easy":
      return "Einfach";
    case "medium":
      return "Mittel";
    case "hard":
      return "Schwer";
    default:
      return "Unbekannt";
  }
};

const getDifficultyColor = (difficulty: string | undefined): string => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTotalMaxPoints = (criteria: Criterion[] | undefined): number => {
  if (!criteria || criteria.length === 0) return 0;
  return criteria.reduce(
    (sum, criterion) => sum + (criterion.max_points || 0),
    0
  );
};

// Platzhalter-Anforderungen
const placeholderRequirements = [
  "Entwickle ein eigenständiges Python-Programm zu einem selbstgewählten Thema",
  "Implementiere mindestens drei verschiedene Funktionen",
  "Verwende objektorientierte Programmierung mit mindestens einer Klasse",
  "Dokumentiere deinen Code mit Kommentaren",
  "Füge eine README-Datei mit Anweisungen zur Ausführung hinzu",
  "Stelle sicher, dass dein Programm fehlerfrei läuft",
];

interface PopupExamOverviewProps {
  exam: Exam;
  attempt?: ExamAttempt | null;
  onClose: () => void;
  onStartExam?: (examId: number) => void;
  onPrepareSubmission?: (attemptId: number) => void;
}

const PopupExamOverview: React.FC<PopupExamOverviewProps> = ({
  exam,
  attempt,
  onClose,
  onStartExam,
  onPrepareSubmission,
}) => {
  const totalMaxPoints = getTotalMaxPoints(exam.criteria);
  const status = attempt ? attempt.status : "available";

  // Animationsvarianten für Framer Motion
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const handleStartClick = () => {
    if (onStartExam && exam) {
      onStartExam(exam.id);
      onClose();
    }
  };

  const handlePrepareSubmissionClick = () => {
    if (onPrepareSubmission && attempt) {
      onPrepareSubmission(attempt.id);
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        variants={popupVariants}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-dsp-orange/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-dsp-orange/15">
                <Info className="h-4 w-4 text-dsp-orange" />
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium border ${getDifficultyColor(
                  exam.exam_difficulty
                )} border-current`}
              >
                {getDifficultyLabel(exam.exam_difficulty)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {exam.exam_title || "Prüfungstitel"}
          </h2>
        </div>

        {/* Content Grid */}
        <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Linke Spalte */}
          <div className="md:col-span-3 space-y-6">
            {/* Beschreibung */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-dsp-orange" />
                <h3 className="font-semibold text-lg text-gray-800">
                  Beschreibung
                </h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 space-y-2 border border-gray-200">
                {(exam.exam_description || "Keine Beschreibung verfügbar.")
                  .split("\n")
                  .map((paragraph, index) => (
                    <p key={index} className={paragraph.trim() ? "" : "h-4"}>
                      {paragraph.trim()}
                    </p>
                  ))}
              </div>
            </section>

            {/* Anforderungen (Platzhalter) */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="h-5 w-5 text-dsp-orange" />
                <h3 className="font-semibold text-lg text-gray-800">
                  Anforderungen
                </h3>
              </div>
              <ul className="bg-gray-50 p-4 rounded-md space-y-2 border border-gray-200">
                {placeholderRequirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <ChevronRight className="h-4 w-4 text-dsp-orange mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Rechte Spalte */}
          <div className="md:col-span-2 space-y-6">
            {/* Fristen & Zeitplan */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-dsp-orange" />
                <h3 className="font-semibold text-lg text-gray-800">
                  Fristen & Zeitplan
                </h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-md space-y-3 border border-gray-200">
                {/* Dauer & Punkte */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex flex-col p-3 border rounded-md bg-white shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="h-4 w-4 text-dsp-orange" />
                      <span className="text-xs font-medium text-gray-600">
                        Dauer
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {exam.exam_duration_week}{" "}
                      {exam.exam_duration_week === 1 ? "Woche" : "Wochen"}
                    </span>
                  </div>
                  <div className="flex flex-col p-3 border rounded-md bg-white shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Award className="h-4 w-4 text-dsp-orange" />
                      <span className="text-xs font-medium text-gray-600">
                        Punkte
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {totalMaxPoints}
                    </span>
                  </div>
                </div>

                {/* Statusabhängige Infos */}
                {status === "available" && (
                  <div className="text-center text-sm text-gray-500 italic py-2">
                    Noch nicht gestartet.
                  </div>
                )}
                {attempt && (
                  <>
                    <InfoLine
                      icon={<Calendar className="h-4 w-4 text-dsp-orange" />}
                      label="Gestartet am"
                      value={formatDate(attempt.started_at)}
                    />
                    <InfoLine
                      icon={
                        <CalendarClock className="h-4 w-4 text-dsp-orange" />
                      }
                      label="Fällig am"
                      value={formatDate(attempt.due_date)}
                      valueClass="text-red-600 font-medium"
                    />
                    {attempt.submitted_at && (
                      <InfoLine
                        icon={
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        }
                        label="Abgegeben am"
                        value={formatDate(attempt.submitted_at)}
                      />
                    )}
                    {attempt.graded_at && (
                      <InfoLine
                        icon={<Info className="h-4 w-4 text-blue-600" />}
                        label="Bewertet am"
                        value={formatDate(attempt.graded_at)}
                      />
                    )}
                    {status === "started" && (
                      <InfoLine
                        icon={<Timer className="h-4 w-4 text-amber-600" />}
                        label="Verbleibende Zeit"
                        value={getRemainingTimeText(attempt.remaining_days)}
                        valueClass="font-medium"
                      />
                    )}
                  </>
                )}
              </div>
            </section>

            {/* Bewertungskriterien */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-dsp-orange" />
                <h3 className="font-semibold text-lg text-gray-800">
                  Bewertungskriterien
                </h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-md space-y-2 border border-gray-200">
                {exam.criteria && exam.criteria.length > 0 ? (
                  exam.criteria.map((criterion) => (
                    <div
                      key={criterion.id}
                      className="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="text-sm text-gray-700">
                        {criterion.title}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {criterion.max_points} Pkt.
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Keine Kriterien definiert.
                  </p>
                )}
                {attempt?.status === "graded" && attempt.criterion_scores && (
                  <div className="pt-3 mt-3 border-t border-gray-300">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">
                      Erreichte Punkte:
                    </h4>
                    {attempt.criterion_scores.map((score) => (
                      <div
                        key={score.id}
                        className="flex justify-between items-center py-1 text-xs"
                      >
                        <span className="text-gray-600">
                          {score.criterion.title}
                        </span>
                        <span className="font-medium text-dsp-blue">
                          {score.achieved_points ?? "N/A"} /{" "}
                          {score.criterion.max_points}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 mt-2 border-t">
                      <span className="text-sm font-semibold text-gray-800">
                        Gesamt
                      </span>
                      <span className="text-lg font-bold text-dsp-blue">
                        {attempt.score ?? "N/A"} / {totalMaxPoints}
                      </span>
                    </div>
                  </div>
                )}
                {attempt?.status === "graded" && attempt.feedback && (
                  <div className="pt-3 mt-3 border-t border-gray-300">
                    <h4 className="text-sm font-semibold text-gray-600 mb-1 flex items-center">
                      <IoChatbubbleEllipsesOutline className="mr-1.5" />{" "}
                      Feedback
                    </h4>
                    <p className="text-xs text-gray-700 bg-white p-2 border rounded whitespace-pre-wrap">
                      {attempt.feedback}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 sm:p-6 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50">
          <ButtonSecondary
            title="Schließen"
            onClick={onClose}
            classNameButton="w-full sm:w-auto"
          />
          {status === "available" && onStartExam && (
            <ButtonPrimary
              title="Prüfung starten"
              icon={<IoRocketOutline />}
              onClick={handleStartClick}
              classNameButton="w-full sm:w-auto"
            />
          )}
          {status === "started" && onPrepareSubmission && (
            <ButtonPrimary
              title="Abgabe vorbereiten"
              icon={<IoCheckmarkDoneOutline />}
              onClick={handlePrepareSubmissionClick}
              classNameButton="w-full sm:w-auto"
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Hilfskomponente für Info-Zeilen in der rechten Spalte
interface InfoLineProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
  valueClass?: string;
}
const InfoLine: React.FC<InfoLineProps> = ({
  icon,
  label,
  value,
  valueClass = "text-gray-800",
}) => (
  <div className="flex items-center gap-3 py-1.5 border-b border-gray-200 last:border-b-0 text-sm">
    <span className="text-gray-500">{icon}</span>
    <div className="flex-grow">
      <span className="text-xs text-gray-500 block">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value ?? "N/A"}</span>
    </div>
  </div>
);

export default PopupExamOverview;

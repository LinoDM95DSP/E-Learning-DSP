import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoClose,
  IoRocketOutline,
  IoSparklesOutline, // Alternativ zu FaBolt
  IoArrowForward,
} from "react-icons/io5";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import ButtonPrimary from "../ui_elements/buttons/button_primary";

interface TaskSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  pointsAwarded?: number;
  onNextTask: () => void;
  isLastTask?: boolean;
}

const TaskSuccessModal: React.FC<TaskSuccessModalProps> = ({
  isOpen,
  onClose,
  taskTitle,
  pointsAwarded = 20,
  onNextTask,
  isLastTask = false,
}) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  };

  const rocketVariants = {
    hover: {
      y: [0, -8, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const flameVariants = {
    pulse: {
      opacity: [0.6, 1, 0.6],
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose} // Schließen bei Klick auf Hintergrund
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col items-center p-8 text-center"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Klick im Modal verhindert Schließen
          >
            {/* Schließen-Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 hover:scale-110 hover:rotate-90 transition-all duration-200 ease-in-out"
              aria-label="Schließen"
            >
              <IoClose size={24} />
            </button>

            {/* Success Icon */}
            <FaCheckCircle className="text-6xl text-green-500 mb-4" />

            {/* Titel */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Wow!</h2>

            {/* Nachricht */}
            <p className="text-gray-600 mb-4">
              Du hast die Aufgabe "
              <span className="font-semibold">{taskTitle}</span>" erfolgreich
              abgeschlossen.
            </p>

            {/* Punkte */}
            <div className="flex items-center justify-center gap-1 text-lg font-medium text-dsp-orange mb-6 bg-dsp-orange_light px-3 py-1 rounded-full border border-dsp-orange">
              <FaStar />
              <span>+{pointsAwarded} Punkte</span>
            </div>

            {/* Raketen Animation */}
            <motion.div
              className="relative mb-6"
              variants={rocketVariants}
              animate="hover" // Startet die Schwebe-Animation
            >
              <IoRocketOutline className="text-7xl text-dsp-orange -rotate-45" />
              {/* Einfaches "Feuer" */}
              <motion.div
                className="absolute bottom-[-5px] left-[5px] w-4 h-4 bg-orange-500 rounded-full blur-sm"
                variants={flameVariants}
                animate="pulse"
              />
              <motion.div
                className="absolute bottom-[-8px] left-[8px] w-3 h-3 bg-yellow-400 rounded-full blur-sm opacity-70"
                variants={flameVariants}
                animate="pulse"
                style={{ animationDelay: "0.1s" }} // leichter Versatz
              />
            </motion.div>

            {/* Motivationsnachricht */}
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-8">
              <IoSparklesOutline className="text-dsp-orange" />
              <span>Weiter so! Du machst großartige Fortschritte.</span>
            </div>

            {/* Button */}
            <ButtonPrimary
              title={
                isLastTask
                  ? "Zur Modulübersicht"
                  : "Weiter zur nächsten Aufgabe"
              }
              icon={!isLastTask ? <IoArrowForward size={20} /> : undefined}
              onClick={onNextTask} // Diese Funktion muss die Navigation handhaben
              classNameButton="w-full justify-center text-base py-2.5"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskSuccessModal;

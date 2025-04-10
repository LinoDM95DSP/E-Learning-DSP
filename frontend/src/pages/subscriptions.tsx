import React from "react";
import { motion } from "framer-motion"; // Import framer-motion
// Optional: Icons importieren, wenn gewünscht
// import { IoCheckmarkCircleOutline } from 'react-icons/io5';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Delay between child animations
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const SubscriptionsPage: React.FC = () => {
  // Beispiel-Daten für Abo-Pläne
  const plans = [
    {
      name: "Basis",
      price: "Kostenlos",
      features: [
        "Zugang zu Einführungsmodulen",
        "Grundlegende Statistiken",
        "Community-Forum",
      ],
      isCurrent: false, // Beispiel: Nutzer hat diesen Plan nicht
      highlight: false,
    },
    {
      name: "Pro",
      price: "19 € / Monat",
      features: [
        "Alle Module freigeschaltet",
        "Detaillierte Statistiken",
        "Priorisierter Support",
        "Abschlussprüfungen",
      ],
      isCurrent: false, // Beispiel
      highlight: true, // Diesen Plan hervorheben
    },
    {
      name: "Enterprise",
      price: "Auf Anfrage",
      features: [
        "Alle Pro-Features",
        "Team-Management",
        "Dedizierter Account Manager",
        "Individuelle Anpassungen",
      ],
      isCurrent: false, // Beispiel
      highlight: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      {" "}
      {/* Mehr vertikaler Abstand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16" // Mehr Abstand nach unten
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
          Wähle deinen Plan
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Finde das Abonnement, das am besten zu deinen Lernzielen passt und
          starte noch heute durch.
        </p>
      </motion.div>
      {/* Animated Grid Container */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible" // Trigger animation on mount
      >
        {plans.map((plan, index) => (
          // Animated Card Wrapper
          <motion.div
            key={index}
            variants={cardVariants} // Apply individual card animation
            whileHover={{ y: -8, scale: plan.highlight ? 1.08 : 1.03 }} // Enhanced hover, slightly more scale for highlight
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`rounded-xl overflow-hidden shadow-xl flex flex-col ${
              // Verbesserter Schatten, rundere Ecken
              plan.highlight
                ? "border-2 border-dsp-orange bg-orange-50 scale-105" // Behält den statischen Scale und Rahmen
                : "border border-gray-200 bg-white"
            }`}
          >
            {/* Card Content */}
            <div className="p-8 flex flex-col flex-grow">
              {" "}
              {/* Mehr Padding */}
              {/* Plan Name */}
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                {" "}
                {/* Größerer Abstand */}
                {plan.name}
              </h2>
              {/* Preis */}
              <p className="text-4xl font-extrabold text-center mb-8 text-gray-900">
                {" "}
                {/* Größerer Abstand, fetter */}
                {plan.price}
              </p>
              {/* Features */}
              <ul className="space-y-4 mb-10 text-gray-700 flex-grow">
                {" "}
                {/* Größerer Abstand zwischen Features */}
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    {" "}
                    {/* items-start für besseren Zeilenumbruch */}
                    <span className="w-5 h-5 bg-dsp-orange rounded-full mr-3 mt-1 flex-shrink-0"></span>{" "}
                    {/* Besserer Abstand */}
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {/* Animated Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                disabled={plan.isCurrent}
                className={`w-full mt-auto py-3 px-4 rounded-lg font-semibold transition duration-150 ease-in-out ${
                  // Größeres Padding, rundere Ecken
                  plan.isCurrent
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : plan.highlight
                    ? "bg-dsp-orange text-white hover:bg-opacity-90 focus:ring-dsp-orange"
                    : "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {plan.isCurrent ? "Aktueller Plan" : "Plan wählen"}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SubscriptionsPage;

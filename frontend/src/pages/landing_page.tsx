import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ButtonPrimary from "../components/ui_elements/buttons/button_primary";
import ButtonSecondary from "../components/ui_elements/buttons/button_secondary";
import LogoDSP from "../assets/dsp_no_background.png"; // Importiere das Logo
import useScrollAnimation from "../hooks/useScrollAnimation"; // Importiere den Hook
import {
  IoRocketOutline,
  IoLayersOutline,
  IoCodeSlashOutline,
  IoChatbubblesOutline,
  IoSchoolOutline,
  IoPlayCircleOutline,
  IoCheckmarkCircleOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";

// Hilfskomponente für animierte Abschnitte
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: string; // Tailwind Delay Klasse, z.B. 'delay-300'
}
const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  delay = "",
}) => {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${delay} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Hilfskomponente für Feature-Karten
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
}
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay,
}) => (
  <AnimatedSection
    delay={delay}
    className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center"
  >
    <div className="inline-block p-4 bg-dsp-orange_light text-dsp-orange rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </AnimatedSection>
);

function LandingPage() {
  // State für Parallax-Effekt
  const [scrollY, setScrollY] = useState(0);

  // Effekt zum Aktualisieren der Scroll-Position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Listener hinzufügen
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup-Funktion
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Leeres Abhängigkeitsarray, damit der Effekt nur einmal registriert wird

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 overflow-x-hidden mx-[-80px] my-[-40px]">
      {/* Hero Section - mit Parallax */}
      <section className="relative overflow-hidden p-6 pt-20 pb-20 flex flex-col items-center justify-center text-center min-h-screen">
        {/* Parallax Hintergrund-Element */}
        <div
          className="absolute inset-x-0 top-0 h-[150%] z-0 bg-gradient-to-br from-orange-100 via-white to-blue-100 opacity-75"
          style={{
            transform: `translateY(${scrollY * 0.4}px)`,
            // Optional: Hier background-image für ein Muster/Grafik setzen
            // backgroundImage: 'url(/path/to/your/data-pattern.svg)',
            // backgroundSize: 'cover',
            // backgroundPosition: 'center',
          }}
        />

        {/* Hero-Inhalt (muss über dem Hintergrund liegen) */}
        <div className="relative z-10">
          {" "}
          {/* z-10 stellt sicher, dass der Inhalt über dem Parallax-Div liegt */}
          <AnimatedSection>
            <img
              src={LogoDSP}
              alt="DataSmart Logo"
              className="h-24 mb-8 mx-auto"
            />
          </AnimatedSection>
          <AnimatedSection delay="delay-100">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Willkommen bei DataSmart Learning!
            </h1>
          </AnimatedSection>
          <AnimatedSection delay="delay-200">
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Deine interaktive Plattform für praxisnahes Lernen im Bereich Data
              Science. Starte jetzt und erweitere deine Fähigkeiten.
            </p>
          </AnimatedSection>
          <AnimatedSection delay="delay-300">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <ButtonPrimary
                  title="Zum Dashboard"
                  onClick={() => {}}
                  classNameButton="w-full sm:w-auto"
                />
              </Link>
              <Link to="/modules">
                <ButtonSecondary
                  title="Module entdecken"
                  onClick={() => {}}
                  classNameButton="w-full sm:w-auto"
                />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Was DataSmart Learning besonders macht
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Entdecke die Vorteile unserer Lernplattform.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={<IoRocketOutline size={28} />}
            title="Praxisnahe Projekte"
            description="Wende dein Wissen direkt in realitätsnahen Projekten und Fallstudien an."
            delay="delay-100"
          />
          <FeatureCard
            icon={<IoLayersOutline size={28} />}
            title="Strukturierte Lernpfade"
            description="Folge klaren Pfaden vom Anfänger bis zum Experten in verschiedenen Data-Science-Bereichen."
            delay="delay-200"
          />
          <FeatureCard
            icon={<IoCodeSlashOutline size={28} />}
            title="Interaktiver Code-Editor"
            description="Übe direkt im Browser mit unserem integrierten Code-Editor und sofortigem Feedback."
            delay="delay-300"
          />
        </div>
      </section>
      {/* How it Works Section */}
      <section className="py-20 px-6 bg-gray-100">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            So einfach funktioniert's
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            In wenigen Schritten zu neuen Data-Science-Skills.
          </p>
        </AnimatedSection>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center ">
          <AnimatedSection delay="delay-100">
            <div className="mb-4">
              <IoPlayCircleOutline
                size={48}
                className="mx-auto text-dsp-orange"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">1. Modul wählen</h3>
            <p className="text-sm text-gray-600">
              Stöbere durch unsere Kurse und wähle das Thema, das dich
              interessiert.
            </p>
          </AnimatedSection>
          <AnimatedSection delay="delay-200">
            <div className="mb-4 ">
              <IoSchoolOutline size={48} className="mx-auto text-dsp-orange" />
            </div>
            <h3 className="text-lg font-semibold mb-2">2. Interaktiv lernen</h3>
            <p className="text-sm text-gray-600">
              Arbeite Videos durch, lies Texte und löse Aufgaben im Code-Editor.
            </p>
          </AnimatedSection>
          <AnimatedSection delay="delay-300">
            <div className="mb-4">
              <IoCheckmarkCircleOutline
                size={48}
                className="mx-auto text-dsp-orange"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">3. Wissen anwenden</h3>
            <p className="text-sm text-gray-600">
              Stelle dein Können in Projekten und der Abschlussprüfung unter
              Beweis.
            </p>
          </AnimatedSection>
        </div>
      </section>
      {/* Course Highlights Section */}
      <section className="py-20 px-6 bg-white">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Entdecke unsere Top-Themen
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Ein Auszug aus unserem vielfältigen Kursangebot.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { name: "Python für Data Science", delay: "delay-100" },
            { name: "Excel für Analysten", delay: "delay-200" },
            { name: "SQL-Datenbanken", delay: "delay-300" },
            { name: "Power BI Dashboards", delay: "delay-400" },
          ].map((item) => (
            <AnimatedSection
              key={item.name}
              delay={item.delay}
              className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center font-medium text-gray-700"
            >
              {item.name}
            </AnimatedSection>
          ))}
        </div>
      </section>
      {/* Testimonials Section (Platzhalter) */}
      <section className="py-20 px-6 bg-gray-100">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Das sagen unsere Nutzer
          </h2>
          {/* <p className="text-gray-600">Optionaler Subtext</p> */}
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[1, 2].map((i) => (
            <AnimatedSection
              key={i}
              delay={`delay-${i * 100}`}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
            >
              <IoChatbubblesOutline className="text-dsp-orange text-3xl mb-3" />
              <p className="text-gray-600 italic mb-4">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua."
              </p>
              <div className="flex items-center">
                <IoPersonCircleOutline className="text-gray-400 text-4xl mr-3" />
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    Max Mustermann {i}
                  </p>
                  <p className="text-xs text-gray-500">
                    Data Analyst bei Firma {i}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
      {/* Final CTA Section */}
      <section className="py-20 px-6 text-center bg-gradient-to-r from-dsp-orange to-orange-500 text-white">
        <AnimatedSection>
          <h2 className="text-3xl font-bold mb-4">
            Bereit, deine Data-Science-Karriere zu starten?
          </h2>
          <p className="mb-8 max-w-xl mx-auto">
            Registriere dich jetzt oder melde dich an, um vollen Zugriff auf
            alle Lerninhalte zu erhalten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <ButtonSecondary
                title="Jetzt starten"
                onClick={() => {}}
                classNameButton="border border-white text-white hover:bg-white hover:text-dsp-orange w-full sm:w-auto"
              />
            </Link>
            <Link to="/modules">
              <ButtonSecondary
                title="Kurse ansehen"
                onClick={() => {}}
                classNameButton="border-white text-white hover:bg-white hover:text-dsp-orange w-full sm:w-auto"
              />
            </Link>
          </div>
        </AnimatedSection>
      </section>
      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500 bg-white border-t border-gray-200">
        © {new Date().getFullYear()} DataSmart Learning. Alle Rechte
        vorbehalten.
        {/* Optional: Links zu Impressum, Datenschutz */}
      </footer>
    </div>
  );
}

export default LandingPage;

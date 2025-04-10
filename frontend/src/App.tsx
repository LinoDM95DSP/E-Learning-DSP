import React, { useState } from "react";
import "./App.css";
// Pages
import Dashboard from "./pages/dashboard";
import Modules from "./pages/modules";
import ModuleDetail from "./pages/module_detail";
import TaskDetails from "./pages/task_detail.tsx";
import FinalExam from "./pages/final_exam";
import Statistics from "./pages/statistics";
import LandingPage from "./pages/landing_page";
import UserSettings from "./pages/user_settings";
import LoginPopup from "./pages/login";
import SubscriptionsPage from "./pages/subscriptions";
// Utils
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Components
import HeaderNavigation from "./components/layouts/header.tsx";
//Assets
import LogoDSP from "./assets/dsp_no_background.png";

// Import the NavItem type
import { NavItem } from "./components/layouts/header.tsx";
// Import Auth Context
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/utils/ProtectedRoute.tsx";

// Verschiebe Navigationsdaten und die Hauptlogik in eine separate Komponente,
// damit `useAuth` verwendet werden kann.
const AppContent: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);

  const openLoginPopup = () => setLoginPopupOpen(true);
  const closeLoginPopup = () => setLoginPopupOpen(false);

  // Passe die Navigation basierend auf dem Login-Status an
  // Hauptnavigation (links/mitte) erwartet `NavLink[]` (immer mit `to`)
  const mainNav: { to: string; title: string; icon?: React.ReactNode }[] = [
    // Nicht eingeloggte Benutzer sehen:
    ...(user === null
      ? [
          // 1. Startseite
          { title: "Startseite", to: "/" },
          // 2. Preise
          { title: "Preise", to: "/subscriptions" },
          // 3. Homepage
          {
            title: "Homepage",
            to: "https://datasmartpoint.com/?campaign=search&gad_source=1&gclid=Cj0KCQjw2N2_BhCAARIsAK4pEkWFhF857MNP-sEAtIJvfG32jDDe1wbcFucbaaWDH-N9DYaHlNN__X4aAoKqEALw_wcB",
          },
        ]
      : []),
    // Eingeloggte Benutzer sehen:
    ...(user !== null
      ? [
          { title: "Dashboard", to: "/dashboard" },
          { title: "Module & Lerninhalte", to: "/modules" },
          { title: "Abschlussprüfungen", to: "/final-exam" },
          { title: "Deine Statistik", to: "/user-stats" },
        ]
      : []),
  ];

  // Rechte Navigation (kann Links oder Aktionen enthalten) erwartet `NavItem[]`
  const currentRightNav: NavItem[] = user
    ? [
        { title: "Einstellungen", to: "/settings" },
        { title: "Ausloggen", action: logout },
      ]
    : [{ title: "Einloggen", action: openLoginPopup }];

  // Zeige einen Ladezustand, während der AuthContext initialisiert wird
  if (isLoading) {
    return <div>Wird geladen...</div>; // Oder eine schönere Ladeanzeige
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <HeaderNavigation
        logo={<img src={LogoDSP} alt="Logo" className="h-12" />}
        links={mainNav}
        rightContent={currentRightNav}
      />

      {/* Main Content */}
      <main className="flex-grow overflow-auto  ">
        <div className="mx-20 my-10 ">
          <Routes>
            {/* Öffentliche Routen */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />

            {/* Geschützte Routen mit ProtectedRoute umschließen */}
            <Route element={<ProtectedRoute />}>
              {/* Kind-Routen von ProtectedRoute */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:moduleId" element={<ModuleDetail />} />
              <Route
                path="/modules/:moduleId/tasks/:taskId"
                element={<TaskDetails />}
              />
              <Route path="/final-exam" element={<FinalExam />} />
              <Route path="/user-stats" element={<Statistics />} />
              <Route path="/settings" element={<UserSettings />} />
            </Route>

            {/* Fallback oder 404 Route */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </div>
      </main>

      {/* Login Popup */}
      {isLoginPopupOpen && <LoginPopup onClose={closeLoginPopup} />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        {" "}
        {/* Wickel die gesamte App in den AuthProvider */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

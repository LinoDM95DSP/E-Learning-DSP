import "./App.css";
// Pages
import Dashboard from "./pages/dashboard";
import Modules from "./pages/modules";
import ModuleDetail from "./pages/module_detail";
import TaskDetails from "./pages/task_detail.tsx";
import FinalExam from "./pages/final_exam";
// Utils
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactNode } from "react";
// Components
import HeaderNavigation from "./components/layouts/header.tsx";
//Assets
import LogoDSP from "./assets/dsp_no_background.png";

const mainNav: { title: string; to: string; icon?: ReactNode }[] = [
  { title: "Dashboard", to: "/dashboard" },
  {
    title: "Module & Lerninhalte",
    to: "/modules",
  },
  {
    title: "Abschlussprüfungen",
    to: "/final-exam",
  },
  {
    title: "Deine Statistik",
    to: "/user-stats",
  },
];

const rightNav: { title: string; to: string; icon?: ReactNode }[] = [
  { title: "Einstellungen", to: "/settings" },
  { title: "Ausloggen", to: "/login" },
];

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <HeaderNavigation
          logo={<img src={LogoDSP} alt="Logo" className="h-12" />}
          links={mainNav}
          rightContent={rightNav}
        />

        {/* Main Content */}
        <main className="flex-grow overflow-auto ">
          <div className="mx-20 my-10 ">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:moduleId" element={<ModuleDetail />} />
              <Route
                path="/module/:moduleId/task/:taskId"
                element={<TaskDetails />}
              />
              <Route path="/final-exam" element={<FinalExam />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;

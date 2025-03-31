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
import SidebarNavigation from "./components/layouts/sidebar_navigation";
//Assets
import { CiHome } from "react-icons/ci";
import { CiGrid42 } from "react-icons/ci";
import { CiMedal } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { TfiStatsUp } from "react-icons/tfi";
import { CiLogout } from "react-icons/ci";

const navigationObj: { title: string; to: string; icon?: ReactNode }[] = [
  { title: "Dashboard", to: "/dashboard", icon: <CiHome size={24} /> },
  {
    title: "Module & Lerninhalte",
    to: "/modules",
    icon: <CiGrid42 size={24} />,
  },
  {
    title: "Abschlussprüfungen",
    to: "/final-exam",
    icon: <CiMedal size={24} />,
  },
];

const middleLinksObj: { title: string; to: string; icon?: ReactNode }[] = [
  {
    title: "Deine Statistik",
    to: "/user-stats",
    icon: <TfiStatsUp size={24} />,
  },
];

const bottomLinksObj: { title: string; to: string; icon?: ReactNode }[] = [
  { title: "Einstellungen", to: "/settings", icon: <CiSettings size={24} /> },
  { title: "Ausloggen", to: "/login", icon: <CiLogout size={24} /> },
];

function App() {
  return (
    <Router>
      <div className="flex flex-row h-screen">
        <div className="flex">
          <SidebarNavigation
            links={navigationObj}
            middleLinks={middleLinksObj}
            bottomLinks={bottomLinksObj}
          />
        </div>
        <div className="flex-grow overflow-auto mt-5">
          <div className="flex items-center justify-center">
            <div className="flex border-1 rounded-full w-200 items-center justify-center">
              Global Searchfield
            </div>
          </div>
          {/* Content*/}
          <div className="mx-20 my-20">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:moduleId" element={<ModuleDetail />} />
              <Route
                path="/module/:moduleId/task/:taskId"
                element={<TaskDetails />}
              />
              <Route path="/final-exam" element={<FinalExam />} />
              {/* Weitere Routen */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

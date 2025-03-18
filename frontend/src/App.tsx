import "./App.css";
// Pages
import Dashboard from "./pages/dashboard";
// Utils
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactNode } from "react";
// Components
import SidebarNavigation from "./components/layouts/sidebar_navigation";
//Assets
import { CiHome } from "react-icons/ci";
import { CiGrid42 } from "react-icons/ci";
import { PiNotebookThin } from "react-icons/pi";
import { PiFlagThin } from "react-icons/pi";
import { CiMedal } from "react-icons/ci";

const navigationObj: { title: string; to: string; icon?: ReactNode }[] = [
  { title: "Dashboard", to: "/home", icon: <CiHome size={24} /> },
  { title: "Module", to: "/modules", icon: <CiGrid42 size={24} /> },
  { title: "Aufgaben", to: "/tasks", icon: <PiNotebookThin size={24} /> },
  { title: "Zwischenprüfung", to: "/tasks", icon: <PiFlagThin size={24} /> },
  { title: "Abschlussprüfung", to: "/tasks", icon: <CiMedal size={24} /> },
];

function App() {
  return (
    <Router>
      <div className="flex flex-row h-screen">
        <div className="flex">
          <SidebarNavigation links={navigationObj} />
        </div>
        <div className="flex-grow overflow-auto pt-5 px-20">
          <div className="flex items-center justify-center"><div className="flex border-1 rounded-full w-200 items-center justify-center">Header Section</div></div>
          {/* Content*/}
          <Routes>
            <Route path="/home" element={<Dashboard />} />
            {/* Weitere Routen */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

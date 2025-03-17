import "./App.css";
// Pages
import HomePage from "./pages/home";
// Utils
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactNode } from "react";
// Components
import SidebarNavigation from "./components/layouts/sidebar_navigation";
import SidebarUser from "./components/layouts/sidebar_user";
//Assets
import { RiHomeLine } from "react-icons/ri";

const navigationObj: { title: string; to: string; icon?: ReactNode }[] = [
  { title: "Dashboard", to: "/home", icon: <RiHomeLine size={24} /> },
  { title: "Module", to: "/modules", icon: <RiHomeLine size={24} />},
  { title: "Aufgaben", to: "/tasks", icon: <RiHomeLine size={24} />},
];

function App() {
  return (
    <Router>
      <div className="flex flex-row h-screen">
        <div className="flex">
          {/* Left */}
          <SidebarNavigation links={navigationObj} />
        </div>

        <div className="flex flex-col items-center justify-center mt-5 ">
          <h1 className="flex justify-center items-center border-1 rounded-full w-100">
            Here comes glob Searchfield
          </h1>
          <div className="flex-grow overflow-auto p-4">
            {/* Content*/}

            <Routes>
              <Route path="/home" element={<HomePage />} />
              {/* Weitere Routen */}
            </Routes>
          </div>
        </div>

        <div>
          {/* Right */}
          <SidebarUser />
        </div>
      </div>
    </Router>
  );
}

export default App;

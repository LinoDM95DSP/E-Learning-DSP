import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { IoRefreshOutline } from "react-icons/io5";
import UserList from "../components/ui_elements/user/UserList";
import ButtonPrimary from "../components/ui_elements/buttons/button_primary";
import CreateUserForm from "../components/ui_elements/forms/create_user_form";
import * as userAdminApi from "../util/apis/userAdminApi";
import AdminPanelExamReviewSection from "./admin_panel_exam_review_section";
import Breadcrumbs from "../components/ui_elements/breadcrumbs";

type TabState = "benutzerliste" | "benutzer-erstellen" | "abschlussprüfungen";

// Stellen Sie sicher, dass die Typen zwischen Frontend und API übereinstimmen
interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabState>("benutzerliste");
  const [sliderStyle, setSliderStyle] = useState({});
  const tabsRef = useRef<HTMLDivElement>(null);

  // Breadcrumbs-Items
  const breadcrumbItems = [{ label: "Admin Panel" }];

  // Zustandsvariablen für die Benutzer
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bestätigungsmodal für Löschvorgänge
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Daten laden
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersResponse = await userAdminApi.getAllUsers();
      setUsers(usersResponse as User[]);
      setError(null);
    } catch (err) {
      console.error("Fehler beim Laden der Benutzer:", err);
      setError(
        "Benutzerdaten konnten nicht geladen werden. Bitte versuche es später erneut."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const activeButton = container.querySelector<HTMLButtonElement>(
      `[data-tab="${activeTab}"]`
    );
    if (activeButton) {
      setSliderStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [activeTab]);

  // Benutzer-Funktionen
  const handleDeleteUser = (userId: number) => {
    // Prüfen, ob der zu löschende Benutzer ein Admin oder Superuser ist
    const userToDelete = users.find((user) => user.id === userId);
    if (userToDelete && (userToDelete.is_staff || userToDelete.is_superuser)) {
      setError("Administratoren und Superuser können nicht gelöscht werden.");
      return;
    }
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete === null) return;

    try {
      setLoading(true);
      await userAdminApi.deleteUser(userToDelete);
      setUsers(users.filter((user) => user.id !== userToDelete));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Fehler beim Löschen des Benutzers:", err);
      setError("Benutzer konnte nicht gelöscht werden.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = () => {
    fetchUsers();
    setActiveTab("benutzerliste");
  };

  const renderTabs = () => (
    <div
      ref={tabsRef}
      className="relative flex space-x-1 border border-gray-300 p-1 rounded-lg bg-gray-100 mb-8 self-start"
    >
      <div
        className="absolute inset-y-0 bg-dsp-orange rounded-md shadow-sm transition-all duration-300 ease-out pointer-events-none"
        style={sliderStyle}
      />
      {(
        [
          "benutzerliste",
          "benutzer-erstellen",
          "abschlussprüfungen",
        ] as TabState[]
      ).map((tab) => (
        <button
          key={tab}
          data-tab={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative z-10 px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer 
            ${
              activeTab === tab
                ? "text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
        >
          {tab === "benutzerliste"
            ? "Benutzerliste"
            : tab === "benutzer-erstellen"
            ? "Benutzer erstellen"
            : "Abschlussprüfungen"}
        </button>
      ))}
    </div>
  );

  // Berechne Statistiken
  const stats = {
    totalUsers: users.length,
    staffUsers: users.filter((u) => u.is_staff).length,
    superUsers: users.filter((u) => u.is_superuser).length,
    activeUsers: users.filter((u) => u.is_active).length,
    inactiveUsers: users.filter((u) => !u.is_active).length,
  };

  return (
    <div className="p-6 min-h-screen bg-background">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-gray-600 mb-6">
          Willkommen im Admin-Bereich. Hier können Sie Benutzer verwalten.
        </p>
      </motion.div>

      {renderTabs()}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {activeTab === "benutzerliste" && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Benutzerliste</h2>
            <div className="flex space-x-2">
              <ButtonPrimary
                title="Aktualisieren"
                icon={<IoRefreshOutline />}
                onClick={fetchUsers}
                disabled={loading}
              />
            </div>
          </div>

          <UserList
            users={users}
            isLoading={loading}
            onDelete={handleDeleteUser}
            stats={stats}
          />
        </div>
      )}

      {activeTab === "benutzer-erstellen" && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <CreateUserForm onUserCreated={handleUserCreated} />
        </div>
      )}

      {activeTab === "abschlussprüfungen" && <AdminPanelExamReviewSection />}

      {/* Lösch-Bestätigungsmodal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium mb-4">Benutzer löschen</h3>
            <p className="text-gray-600 mb-6">
              Möchten Sie diesen Benutzer wirklich löschen? Diese Aktion kann
              nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
              >
                Abbrechen
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
                onClick={confirmDeleteUser}
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import api from "../util/apis/api";

// --- Type Definitions (Derived from Backend Models) ---

export interface SupplementaryContentItem {
  label: string;
  url: string;
  order: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  difficulty: string; // e.g., 'Einfach', 'Mittel', 'Schwer'
  hint?: string | null;
  order: number;
  test_file_path?: string; // Possibly needed for editor linking
  completed: boolean;
}

export interface Content {
  id: number;
  title: string;
  description: string;
  video_url?: string | null;
  order: number;
  supplementary_title?: string | null;
  supplementary_contents?: SupplementaryContentItem[];
}

export interface Module {
  id: number;
  title: string;
  is_public: boolean;
  contents?: Content[];
  tasks?: Task[];
}

// --- Context Type Definition ---
interface ModuleContextType {
  modules: Module[];
  loading: boolean;
  error: Error | null;
  fetchModules: () => Promise<void>; // Make it async for potential use
}

// --- Create Context ---
// Initialize with default values matching the type structure
const ModuleContext = createContext<ModuleContextType>({
  modules: [],
  loading: true,
  error: null,
  fetchModules: async () => {
    console.warn("ModuleProvider not initialized");
  },
});

// --- Provider Component ---
interface ModuleProviderProps {
  children: ReactNode;
}

export const ModuleProvider: React.FC<ModuleProviderProps> = ({ children }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchModules = async () => {
    const authTokens = localStorage.getItem("authTokens");
    if (!authTokens) {
      setModules([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Module[]>("/modules/user/");

      const sortedModules = response.data
        .map((module) => ({
          ...module,
          contents: [...(module.contents || [])].sort(
            (a, b) => a.order - b.order
          ),
          tasks: [...(module.tasks || [])].sort((a, b) => a.order - b.order),
        }))
        .sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
      setModules(sortedModules);
    } catch (err) {
      console.error("Error fetching modules:", err);
      const fetchError =
        err instanceof Error ? err : new Error("Failed to fetch modules");
      setError(fetchError);
      setModules([]); // Clear modules on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authTokens = localStorage.getItem("authTokens");
    if (authTokens) {
      fetchModules();
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authTokens") {
        if (e.newValue) {
          fetchModules();
        } else {
          setModules([]);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value: ModuleContextType = {
    modules,
    loading,
    error,
    fetchModules,
  };

  return (
    <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
  );
};

// --- Custom Hook for easy access ---
export const useModules = (): ModuleContextType => {
  const context = useContext(ModuleContext);
  // No need to check for undefined if context provides default values
  // if (context === undefined) {
  //     throw new Error('useModules must be used within a ModuleProvider');
  // }
  return context;
};

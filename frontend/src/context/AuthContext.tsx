import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import api from "../util/apis/api"; // Importiere die konfigurierte Axios-Instanz
import axios from "axios"; // Sicherstellen, dass axios importiert ist

interface AuthTokens {
  access: string;
  refresh: string;
}

// Typ für die Daten, die vom /api/token/ Endpunkt kommen
interface LoginApiResponse extends AuthTokens {
  require_password_change?: boolean; // Optionales Flag
}

interface DecodedToken extends JwtPayload {
  user_id: number;
  username: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  // Füge hier andere erwartete Felder aus deinem JWT Payload hinzu (z.B. username, email)
}

// Typ für die Rückgabe der login Funktion im Context
interface LoginResult {
  success: boolean;
  require_password_change?: boolean;
  error?: string;
}

interface AuthContextType {
  tokens: AuthTokens | null;
  user: DecodedToken | null;
  login: (credentials: {
    username: string;
    password: string;
  }) => Promise<LoginResult>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tokens, setTokens] = useState<AuthTokens | null>(() => {
    const storedTokens = localStorage.getItem("authTokens");
    return storedTokens ? JSON.parse(storedTokens) : null;
  });
  const [user, setUser] = useState<DecodedToken | null>(() => {
    const storedTokens = localStorage.getItem("authTokens");
    if (storedTokens) {
      try {
        const decoded = jwtDecode<DecodedToken>(
          JSON.parse(storedTokens).access
        );
        // Optional: Überprüfe hier die Gültigkeit des Tokens (exp)
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp > currentTime) {
          return decoded;
        } else {
          // Token abgelaufen, entferne es
          localStorage.removeItem("authTokens");
          return null;
        }
      } catch (error) {
        console.error("Error decoding token on initial load:", error);
        localStorage.removeItem("authTokens"); // Entferne ungültige Tokens
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true); // Startet als true, bis Initialisierung abgeschlossen

  useEffect(() => {
    // Dieser Effekt initialisiert nur den User-State basierend auf den Tokens.
    // Das Laden des Zustands aus localStorage geschieht bereits in useState.
    if (tokens) {
      try {
        const decoded = jwtDecode<DecodedToken>(tokens.access);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp > currentTime) {
          setUser(decoded);
        } else {
          console.log(
            "Access token expired on load, attempting refresh or logout needed."
          );
          // logout() ist jetzt async, aber hier wollen wir nicht unbedingt warten
          // Es ist vielleicht besser, den Refresh direkt hier oder im Interceptor zu behandeln
          // Fürs Erste: Token entfernen und User null setzen, der Interceptor sollte den Rest regeln
          localStorage.removeItem("authTokens");
          setTokens(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error decoding token on initial load:", error);
        localStorage.removeItem("authTokens");
        setTokens(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [tokens]);

  // Login Funktion neu implementieren
  const login = async (credentials: {
    username: string;
    password: string;
  }): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await api.post<LoginApiResponse>("/token/", {
        username: credentials.username,
        password: credentials.password,
      });

      const data = response.data;
      if (data && data.access && data.refresh) {
        const newTokens: AuthTokens = {
          access: data.access,
          refresh: data.refresh,
        };
        const decoded = jwtDecode<DecodedToken>(newTokens.access);
        localStorage.setItem("authTokens", JSON.stringify(newTokens));
        setTokens(newTokens);
        setUser(decoded);
        console.log("User logged in, tokens stored.");
        return {
          success: true,
          require_password_change: data.require_password_change ?? false, // Default auf false setzen
        };
      } else {
        return {
          success: false,
          error: "Ungültige Antwort vom Server erhalten.",
        };
      }
    } catch (err: unknown) {
      console.error("Error during login API call:", err);
      let errorMessage =
        "Login fehlgeschlagen. Bitte versuchen Sie es später erneut.";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          errorMessage = "Ungültige Anmeldedaten.";
        } else if (err.response?.data?.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response?.status === 404) {
          errorMessage = "Login-Service nicht erreichbar.";
        }
      }
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    console.log("Logging out...");
    const storedTokens = localStorage.getItem("authTokens");
    const refreshToken = storedTokens ? JSON.parse(storedTokens).refresh : null;

    if (refreshToken) {
      try {
        // Sende das Refresh-Token an den Logout-Endpunkt
        await api.post("/users/logout/", { refresh: refreshToken });
        console.log("Logout successful on backend.");
      } catch (error) {
        // Fehler beim Backend-Logout ignorieren oder loggen, aber trotzdem lokal ausloggen
        console.error(
          "Backend logout failed, proceeding with local logout:",
          error
        );
      }
    }

    // Lokale Daten immer entfernen
    localStorage.removeItem("authTokens");
    setTokens(null);
    setUser(null);
    setIsLoading(false);
    // Optional: Navigiere zur Startseite
    // window.location.href = '/'; // Oder useNavigate verwenden
  };

  // Die Token-Refresh-Logik ist jetzt im Axios-Interceptor in api.ts

  const contextData: AuthContextType = {
    tokens,
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

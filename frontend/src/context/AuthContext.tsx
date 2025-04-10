import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import api from "../util/apis/api"; // Importiere die konfigurierte Axios-Instanz

interface AuthTokens {
  access: string;
  refresh: string;
}

interface DecodedToken extends JwtPayload {
  user_id: number;
  // Füge hier andere erwartete Felder aus deinem JWT Payload hinzu (z.B. username, email)
}

interface AuthContextType {
  tokens: AuthTokens | null;
  user: DecodedToken | null;
  login: (tokens: AuthTokens) => void;
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

  const login = (newTokens: AuthTokens) => {
    setIsLoading(true);
    try {
      const decoded = jwtDecode<DecodedToken>(newTokens.access);
      localStorage.setItem("authTokens", JSON.stringify(newTokens));
      setTokens(newTokens);
      setUser(decoded);
      console.log("User logged in, tokens stored.");
    } catch (error) {
      console.error("Error decoding token on login:", error);
      // Handle error appropriately, maybe clear tokens
      localStorage.removeItem("authTokens");
      setTokens(null);
      setUser(null);
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
        await api.post("/api/users/logout/", { refresh: refreshToken });
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

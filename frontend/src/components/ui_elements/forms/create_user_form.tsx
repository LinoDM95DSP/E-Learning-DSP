import React, { useState } from "react";
import { motion } from "framer-motion";
import * as userAdminApi from "../../../util/apis/userAdminApi";

interface CreateUserFormProps {
  onUserCreated?: () => void;
  onCancel?: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  onUserCreated,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError("Benutzername muss mindestens 3 Zeichen lang sein.");
      return false;
    }

    if (!formData.email || !formData.email.includes("@")) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return false;
    }

    if (!formData.first_name) {
      setError("Bitte geben Sie einen Vornamen ein.");
      return false;
    }

    if (!formData.last_name) {
      setError("Bitte geben Sie einen Nachnamen ein.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const initialPassword = "forcepassword123";

      await userAdminApi.createUser({
        ...formData,
        password: initialPassword,
        is_staff: false,
        is_superuser: false,
        is_active: true,
      });

      setSuccess(true);
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
      });

      if (onUserCreated) {
        onUserCreated();
      }
    } catch (err: unknown) {
      console.error("Fehler beim Erstellen des Benutzers:", err);
      interface ErrorResponse {
        response?: {
          data?: { [key: string]: string[] | string };
          status?: number;
        };
        message?: string;
      }
      const error = err as ErrorResponse;
      let errorMessage =
        "Benutzer konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.";
      if (error.response?.data) {
        const data = error.response.data;
        const fieldErrors = Object.entries(data)
          .map(([key, value]) => {
            if (key === "password") return null;
            if (Array.isArray(value)) {
              return `${key}: ${value.join(", ")}`;
            } else if (typeof value === "string") {
              return `${key}: ${value}`;
            }
            return null;
          })
          .filter(Boolean)
          .join("; ");
        if (fieldErrors) {
          errorMessage = `Fehler: ${fieldErrors}`;
        } else if (typeof data === "string") {
          errorMessage = data;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=""
    >
      <h2 className="text-xl font-semibold mb-6">Neuen Benutzer erstellen</h2>

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
          Benutzer erfolgreich erstellt. Das initiale Passwort ist
          'forcepassword123'. Der Benutzer muss es beim ersten Login ändern.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Benutzername *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dsp-orange focus:border-dsp-orange"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-Mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dsp-orange focus:border-dsp-orange"
              required
            />
          </div>

          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Vorname *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dsp-orange focus:border-dsp-orange"
              required
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nachname *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dsp-orange focus:border-dsp-orange"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Abbrechen
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-2 rounded-lg py-2 px-4 bg-dsp-orange p-2 hover:cursor-pointer focus:outline-none hover:font-bold text-white font-bold"
          >
            {loading ? "Wird erstellt..." : "Benutzer erstellen"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateUserForm;

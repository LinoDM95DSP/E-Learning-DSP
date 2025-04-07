import React from "react";
import type { DifficultyLevel } from "../tags/tag_difficulty";
import { IoSearch } from "react-icons/io5";

interface FilterHeadProps {
  title: string;
  subtitle?: string;
  searchTerm: string;
  activeDifficultyFilters: DifficultyLevel[];
  onSearchChange: (term: string) => void;
  onDifficultyFilterChange: (difficulty: DifficultyLevel) => void;
  availableDifficulties?: DifficultyLevel[]; // Optional: Falls nicht immer alle 3 gebraucht werden
}

const FilterHead: React.FC<FilterHeadProps> = ({
  title,
  subtitle,
  searchTerm,
  activeDifficultyFilters,
  onSearchChange,
  onDifficultyFilterChange,
  availableDifficulties = ["Einfach", "Mittel", "Schwer"], // Standardmäßig alle 3
}) => {
  return (
    <div className="mb-6">
      {" "}
      {/* Container für alles */}
      {/* Obere Zeile: Titel vs. Schwierigkeitsfilter */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-base text-gray-600">{subtitle}</p>
          )}
        </div>
        <div className="flex gap-3 flex-shrink-0">
          {availableDifficulties.map((level) => (
            <button
              key={level}
              onClick={() => onDifficultyFilterChange(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 
                ${
                  activeDifficultyFilters.includes(level)
                    ? "bg-dsp-orange text-white border-dsp-orange"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      {/* Untere Zeile: Suchleiste */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IoSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={`${title} suchen...`}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-dsp-orange focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default FilterHead;

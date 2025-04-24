import React from "react";
import { IoSearch } from "react-icons/io5";
import type { DifficultyLevel } from "../tags/tag_difficulty";
import TagDifficulty from "../tags/tag_difficulty";

interface FilterHeadProps {
  title: string;
  subtitle?: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  className?: string;
}

const FilterHead: React.FC<FilterHeadProps> = ({
  title,
  subtitle,
  searchTerm,
  onSearchChange,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 ${className}`}
    >
      {title && (
        <h2 className="text-xl font-semibold text-gray-700 flex-shrink-0">
          {title}
        </h2>
      )}

      <div className="flex-grow w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
        {/* Suchfeld */}
        <div className="relative w-full sm:max-w-xs">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Module durchsuchen..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-dsp-orange focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterHead;

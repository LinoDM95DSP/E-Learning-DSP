import React from "react";
import TagDifficulty from "./tag_difficulty";
// Importiere/Definiere den Typ hier oder aus einer zentralen Datei
export type DifficultyLevel = "Einfach" | "Mittel" | "Schwer";

// Definiere Task-Typ hier oder importiere ihn
export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
}

interface TagCalculatedDifficultyProps {
  tasks?: Task[]; // Mache tasks optional
}

const TagCalculatedDifficulty: React.FC<TagCalculatedDifficultyProps> = ({
  tasks,
}) => {
  // Funktion zur Berechnung (intern)
  const calculateAverageDifficulty = (
    localTasks: Task[] // Verwende den lokalen Parameter
  ): DifficultyLevel | null => {
    if (!localTasks || localTasks.length === 0) {
      return null;
    }

    const difficultyMap: Record<DifficultyLevel, number> = {
      Einfach: 1,
      Mittel: 2,
      Schwer: 3,
    };

    const totalDifficultyScore = localTasks.reduce(
      (sum, task) => sum + (difficultyMap[task.difficulty] || 0),
      0
    );

    const averageScore = totalDifficultyScore / localTasks.length;

    if (averageScore < 1.7) {
      return "Einfach";
    } else if (averageScore <= 2.3) {
      return "Mittel";
    } else {
      return "Schwer";
    }
  };

  const calculatedDifficulty = calculateAverageDifficulty(tasks || []); // Rufe interne Funktion auf

  // Rendere das Tag nur, wenn eine Schwierigkeit berechnet wurde
  if (!calculatedDifficulty) {
    return null;
  }

  return <TagDifficulty difficulty={calculatedDifficulty} />;
};

export default TagCalculatedDifficulty;

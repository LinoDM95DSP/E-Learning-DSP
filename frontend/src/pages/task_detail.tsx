import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import modulesObj from "../util/modules/modules_object";
import ButtonPrimary from "../components/ui_elements/buttons/button_primary";
import ButtonSecondary from "../components/ui_elements/buttons/button_secondary";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { IoBulbOutline, IoInformationCircleOutline } from "react-icons/io5";
import CodeEditorWithOutput from "../components/ui_elements/code_editor/code_editor_with_output";
import TagDifficulty from "../components/tags/tag_difficulty";
import type { DifficultyLevel } from "../components/tags/tag_difficulty";
import Breadcrumbs from "../components/ui_elements/breadcrumbs";

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  hint?: string;
}

function TaskDetails() {
  const { moduleId, taskId } = useParams();
  const navigate = useNavigate();
  const [isHintVisible, setIsHintVisible] = useState(false);

  const module = modulesObj.find((mod) => mod.id === moduleId);

  if (!module) {
    const errorItems = [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Module", path: "/modules" },
      { label: "Fehler" },
    ];
    return (
      <div className="p-6">
        <Breadcrumbs items={errorItems} />
        <p>Modul nicht gefunden.</p>
      </div>
    );
  }

  const tasks: Task[] = (module.tasks || []) as Task[];
  const currentTaskIndex = tasks.findIndex((t) => t.id === taskId);

  if (currentTaskIndex === -1) {
    const taskNotFoundErrorBreadcrumbs = [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Module", path: "/modules" },
      { label: module.title, path: `/modules/${moduleId}` },
      { label: "Fehler" },
    ];
    return (
      <div className="p-6">
        <Breadcrumbs items={taskNotFoundErrorBreadcrumbs} />
        <p>Aufgabe nicht gefunden.</p>
      </div>
    );
  }

  const currentTask = tasks[currentTaskIndex];
  const nextTask = tasks[currentTaskIndex + 1];
  const previousTask = tasks[currentTaskIndex - 1];
  const isFirstTask = currentTaskIndex === 0;
  const isLastTask = currentTaskIndex === tasks.length - 1;

  const breadcrumbItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Module", path: "/modules" },
    { label: module.title, path: `/modules/${moduleId}` },
    { label: currentTask.title },
  ];

  return (
    <div className="p-6 flex flex-col">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <h1 className="text-3xl font-bold text-gray-800">Aufgabendetail</h1>
      <p className="text-base text-gray-600 mb-6">
        Bearbeite den Code und nutze den Hinweis bei Bedarf.
      </p>

      <div className="flex gap-6 min-h-0">
        <div className="w-1/3 bg-white p-6 rounded-lg border border-gray-300 shadow-sm flex flex-col min-h-0">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-xl font-bold text-gray-800">
              {currentTask.title}
            </h2>
            <TagDifficulty difficulty={currentTask.difficulty} />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Löse diese Aufgabe, um dein Verständnis zu testen.
          </p>
          <div className="overflow-y-auto flex-grow mb-4">
            <p className="text-gray-700 whitespace-pre-wrap">
              {currentTask.description}
            </p>
          </div>
          {currentTask.hint && (
            <div className="mt-auto border-t border-gray-200 pt-4">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out mb-4 ${
                  isHintVisible
                    ? "max-h-[200px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 rounded-lg bg-dsp-orange_light border border-dsp-orange">
                  <div className="flex items-center gap-2 text-dsp-orange font-semibold mb-2">
                    <IoBulbOutline size={20} />
                    <span>Hinweis</span>
                  </div>
                  <p className="text-sm text-gray-800">{currentTask.hint}</p>
                </div>
              </div>
              <ButtonSecondary
                title={
                  isHintVisible ? "Hinweis ausblenden" : "Hinweis anzeigen"
                }
                icon={<IoInformationCircleOutline size={20} />}
                onClick={() => setIsHintVisible(!isHintVisible)}
                classNameButton="w-full text-sm justify-center py-1.5"
                iconPosition="left"
              />
            </div>
          )}
        </div>
        <div className="w-2/3 flex flex-col min-h-0">
          <CodeEditorWithOutput />
        </div>
      </div>
      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
        <ButtonSecondary
          title="Vorherige Aufgabe"
          icon={<IoIosArrowRoundBack size={30} />}
          onClick={() =>
            navigate(`/module/${moduleId}/task/${previousTask?.id}`)
          }
          disabled={isFirstTask}
          classNameButton={`flex-row-reverse ${
            isFirstTask ? "opacity-50 cursor-not-allowed" : ""
          }`}
          iconPosition="left"
        />
        <ButtonPrimary
          title="Nächste Aufgabe"
          icon={<IoIosArrowRoundForward size={30} />}
          onClick={() => navigate(`/module/${moduleId}/task/${nextTask?.id}`)}
          disabled={isLastTask}
          classNameButton={`${
            isLastTask ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
      </div>
    </div>
  );
}

export default TaskDetails;

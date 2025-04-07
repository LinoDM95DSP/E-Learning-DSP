// TaskDetails.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import modulesObj from "../util/modules/modules_object";
import ButtonPrimary from "../components/ui_elements/buttons/button_primary";
import ButtonSecondary from "../components/ui_elements/buttons/button_secondary";
import { IoIosArrowRoundForward } from "react-icons/io";
import CodeEditorWithOutput from "../components/ui_elements/code_editor/code_editor_with_output";

function TaskDetails() {
  const { moduleId, taskId } = useParams();
  const navigate = useNavigate();

  const module = modulesObj.find((mod) => mod.id === moduleId);
  if (!module) {
    return <p>Modul nicht gefunden.</p>;
  }
  const tasks = module.tasks || [];
  const currentTaskIndex = tasks.findIndex((t) => t.id === taskId);
  const nextTask = tasks[currentTaskIndex + 1];
  const previousTask = tasks[currentTaskIndex - 1];

  return (
    <div className="p-6">
      <div className="flex gap-6">
        <div className="w-1/3 bg-white p-6 rounded-lg border border-gray-300 ">
          <h1 className="text-xl font-bold mb-4">
            {tasks[currentTaskIndex]?.title}
          </h1>
          <p className="text-gray-700">
            {tasks[currentTaskIndex]?.description}
          </p>
        </div>
        <div className="w-2/3">
          <CodeEditorWithOutput />
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <ButtonSecondary
          title="Vorherige Aufgabe"
          onClick={() =>
            navigate(`/module/${moduleId}/task/${previousTask.id}`)
          }
        />
        <ButtonPrimary
          title="Nächste Aufgabe"
          icon={<IoIosArrowRoundForward size={30} />}
          onClick={() => navigate(`/module/${moduleId}/task/${nextTask.id}`)}
        />
      </div>
    </div>
  );
}

export default TaskDetails;

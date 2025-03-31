// TaskDetails.tsx
import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import modulesObj from "../util/modules/modules_object";
import ButtonPrimary from "../components/ui_elements/buttons/button_primary";
import ButtonSecondary from "../components/ui_elements/buttons/button_secondary";
import { IoIosArrowRoundForward } from "react-icons/io";
import CodeEditorWithOutput, {
  CodeEditorWithOutputHandle,
} from "../components/ui_elements/code_editor/code_editor_with_output";

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

  const editorRef = useRef<CodeEditorWithOutputHandle>(null);

  return (
    <div className="">
      <div className="flex rounded-md">
        <div className="w-1/3 ">
          <h1 className="text-xl font-bold">
            {tasks[currentTaskIndex]?.title}
          </h1>
          <p className="text-gray-700 mt-2">
            {tasks[currentTaskIndex]?.description}
          </p>
        </div>
        <CodeEditorWithOutput ref={editorRef} />
      </div>
      <div className="flex justify-between mt-5">
        <ButtonSecondary
          title="Vorherige Aufgabe"
          onClick={() =>
            navigate(`/module/${moduleId}/task/${previousTask.id}`)
          }
        />
        <ButtonPrimary
          title="Code ausführen"
          onClick={() => editorRef.current?.handleRunCode()}
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

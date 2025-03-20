import { useParams, useNavigate } from "react-router-dom";
import modulesObj from "../util/modules/modules_object";
import ButtonPrimary from "../components/ui_elements/buttons/button_primary";
import { IoIosArrowRoundForward } from "react-icons/io";

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

  return (
    <div>
      <h1 className="text-xl font-bold">{tasks[currentTaskIndex]?.title}</h1>
      <p className="text-gray-700 mt-2">
        {tasks[currentTaskIndex]?.description}
      </p>

      <div className="flex justify-end mt-5">
        {/* Button zur nächsten Aufgabe */}
        {nextTask && (
          <ButtonPrimary
            title="Nächste Aufgabe"
            icon={<IoIosArrowRoundForward size={30} />}
            onClick={() => navigate(`/module/${moduleId}/task/${nextTask.id}`)}
          />
        )}
      </div>
    </div>
  );
}

export default TaskDetails;

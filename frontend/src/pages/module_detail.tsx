import { useParams, useNavigate } from "react-router-dom";
import modulesObj from "../util/modules/modules_object";
import LearningContentVideoLayout from "../components/layouts/learning_content_video";
import ButtonPrimary from "../components/ui_elements/buttons/button_primary";
import { IoIosArrowRoundForward } from "react-icons/io";

function ModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const module = modulesObj.find((mod) => mod.id === moduleId);

  if (!module) {
    return <p>Modul nicht gefunden.</p>;
  }

  const tasks = module.tasks || [];

  return (
    <div>
      <h1>{module.title}</h1>
      <LearningContentVideoLayout {...module.content} />

      {/* Aufgabenliste */}
      <div className="mt-5">
        <h2 className="text-lg font-semibold">Aufgaben</h2>
        {tasks.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-4 border rounded-md shadow-md cursor-pointer hover:bg-gray-100 transition"
                onClick={() => navigate(`/module/${moduleId}/task/${task.id}`)}
              >
                <h3 className="text-md font-bold">{task.title}</h3>
                <p className="text-sm text-gray-700">{task.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">
            Keine Aufgaben für dieses Modul verfügbar.
          </p>
        )}
      </div>
    </div>
  );
}

export default ModuleDetail;

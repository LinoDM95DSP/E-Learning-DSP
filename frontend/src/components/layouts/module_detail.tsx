
// ModuleDetail.js
import { useParams } from 'react-router-dom';
import modulesObj from '../../util/modules/modules_object';
import LearningContentVideoLayout from './learning_content_video';

function ModuleDetail() {
  const { moduleId } = useParams();
  const module = modulesObj.find((mod) => mod.id === moduleId);

  if (!module) {
    return <p>Modul nicht gefunden.</p>;
  }

  return (
    <div>
      <h1>{module.title}</h1>
      <LearningContentVideoLayout {...module.content} />
    </div>
  );
}

export default ModuleDetail;

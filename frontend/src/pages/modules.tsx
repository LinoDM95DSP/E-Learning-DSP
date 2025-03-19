import CardPreviewSmall from "../components/cards/card_preview_small";
import modulesObj from "../util/modules/modules_object";


function Modules() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Module</h1>
      <div className="flex flex-wrap gap-10">
        {modulesObj.map((module, index) => (
          <CardPreviewSmall
            key={index}
            title={module.title}
            imageSrc={module.imageSrc}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
            progress={module.progress}
          />
        ))}
      </div>
    </div>
  );
}

export default Modules;

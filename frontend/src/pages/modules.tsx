// Modules.tsx
import { Link } from "react-router-dom";
import CardPreviewSmall from "../components/cards/card_preview_small";
import modulesObj from "../util/modules/modules_object";

function Modules() {
  const getFirstYoutubeId = (module: any): string | undefined => {
    const contentArray = Array.isArray(module.content)
      ? module.content
      : [module.content];

    const firstVideoUrl = contentArray?.[0]?.videoUrl;
    if (!firstVideoUrl) return;

    const match = firstVideoUrl.match(/embed\/([a-zA-Z0-9_-]{11})/);
    return match?.[1];
  };

  return (
    <div className="p-4">
      <h1 className="text-5xl font-bold mb-10">Module</h1>

      {/* Responsive Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {modulesObj.map((module) => (
          <Link key={module.id} to={`/modules/${module.id}`}>
            <CardPreviewSmall
              title={module.title}
              progress={module.progress}
              youtubeId={getFirstYoutubeId(module)}
              className="w-full hover:bg-dsp-orange_light transition-all duration-300 ease-in-out border border-gray-300"
              classNameTitle="text-left text-2xl"
              classNameDescription="text-left"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Modules;

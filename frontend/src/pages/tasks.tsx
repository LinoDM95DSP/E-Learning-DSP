import CardPreviewSmall from "../components/cards/card_preview_small";
import ExampleImage from "../assets/example_module.png";

const modulesObj = [
  {
    imageSrc: ExampleImage,
    title: "Python",
    description: "Python Grundlagen",
    progress: 85,
  },
  {
    imageSrc: ExampleImage,
    title: "JavaScript",
    description: "Einführung in JavaScript",
    progress: 70,
  },
  {
    imageSrc: ExampleImage,
    title: "Java",
    description: "Objektorientierte Programmierung mit Java",
    progress: 60,
  },
  {
    imageSrc: ExampleImage,
    title: "C#",
    description: "C# für Anfänger",
    progress: 55,
  },
  {
    imageSrc: ExampleImage,
    title: "C++",
    description: "C++ Programmierung",
    progress: 45,
  },
  {
    imageSrc: ExampleImage,
    title: "Ruby",
    description: "Ruby on Rails Grundlagen",
    progress: 50,
  },
  {
    imageSrc: ExampleImage,
    title: "Go",
    description: "Go Programmierung",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "Swift",
    description: "iOS Entwicklung mit Swift",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "Kotlin",
    description: "Android Entwicklung mit Kotlin",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "PHP",
    description: "Webentwicklung mit PHP",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "R",
    description: "Datenanalyse mit R",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "MATLAB",
    description: "MATLAB für Ingenieure",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "Perl",
    description: "Perl Programmierung",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "Scala",
    description: "Funktionale Programmierung mit Scala",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "Rust",
    description: "Systems Programming mit Rust",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "Dart",
    description: "Flutter Entwicklung mit Dart",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "Lua",
    description: "Spieleentwicklung mit Lua",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "Shell Scripting",
    description: "Automatisierung mit Shell Scripting",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "PowerShell",
    description: "Windows Automatisierung mit PowerShell",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "HTML/CSS",
    description: "Webdesign mit HTML und CSS",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "SAS",
    description: "Datenanalyse mit SAS",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "SQL",
    description: "Datenbankabfragen mit SQL",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "Excel",
    description: "Datenanalyse mit Excel",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "ChatGPT",
    description: "Arbeiten mit ChatGPT",
    progress: 0,
  },
  {
    imageSrc: ExampleImage,
    title: "TypeScript",
    description: "Typisierte JavaScript-Entwicklung mit TypeScript",
    progress: 0,
  },
];

function Tasks() {
  return (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Aufgaben</h1>
          <div className="flex flex-wrap gap-10">
            {modulesObj.map((module, index) => (
              <CardPreviewSmall
                key={index}
                title={module.title}
                description={module.description}
                imageSrc={module.imageSrc}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                progress={module.progress}
              />
            ))}
          </div>
        </div>
  );
}

export default Tasks;

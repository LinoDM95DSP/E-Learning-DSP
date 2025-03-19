// pages/Modules.tsx
import ExampleImage from "../assets/example_module.png";

const modulesObj = [
  {
    imageSrc: ExampleImage,
    title: "Python",
    progress: 100,
    content: {
      videoUrl: "https://www.youtube.com/embed/MVRmWIt6rfA",
      title: "Einführung in Python",
      description: "Lerne die Grundlagen der Python-Programmierung.",
      supplementaryTitle: "Weiterführende Ressourcen",
      supplementaryContent: [
        {
          label: "Offizielle Python-Dokumentation",
          url: "https://docs.python.org/",
        },
        {
          label: "Python Tutorial auf W3Schools",
          url: "https://www.w3schools.com/python/",
        },
      ],
    },
  },
  {
    imageSrc: ExampleImage,
    title: "JavaScript",
    progress: 42,
    content: {
      videoUrl: "https://www.youtube.com/embed/MVRmWIt6rfA",
      title: "JavaScript für Einsteiger",
      description:
        "Verstehe die Grundlagen von JavaScript und seine Anwendung.",
      supplementaryTitle: "Nützliche Links",
      supplementaryContent: [
        {
          label: "MDN JavaScript Guide",
          url: "https://developer.mozilla.org/de/docs/Web/JavaScript/Guide",
        },
        { label: "JavaScript.info", url: "https://javascript.info/" },
      ],
    },
  },
  // Weitere Module...
];

export default modulesObj;

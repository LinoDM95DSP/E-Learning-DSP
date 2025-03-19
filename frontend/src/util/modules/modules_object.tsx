// pages/Modules.tsx
import ExampleImage from "../../assets/example_module.png";

const modulesObj = [
  // Python Module
  {
    id: "python_basics",
    imageSrc: ExampleImage,
    title: "Python Grundlagen",
    progress: 100,
    content: {
      videoUrl: "https://www.youtube.com/embed/rfscVS0vtbw",
      title: "Python für Anfänger",
      description: "Erlernen Sie die Grundlagen der Python-Programmierung.",
      supplementaryTitle: "Weiterführende Ressourcen",
      supplementaryContent: [
        {
          label: "Offizielle Python-Dokumentation",
          url: "https://docs.python.org/3/",
        },
        {
          label: "Python Tutorial auf W3Schools",
          url: "https://www.w3schools.com/python/",
        },
      ],
    },
  },
  {
    id: "python_advanced",
    imageSrc: ExampleImage,
    title: "Fortgeschrittenes Python",
    progress: 75,
    content: {
      videoUrl: "https://www.youtube.com/embed/HGOBQPFzWKo",
      title: "Fortgeschrittene Python-Konzepte",
      description:
        "Vertiefen Sie Ihr Wissen in Python mit fortgeschrittenen Themen.",
      supplementaryTitle: "Weiterführende Ressourcen",
      supplementaryContent: [
        {
          label: "Python Decorators - Real Python",
          url: "https://realpython.com/primer-on-python-decorators/",
        },
        {
          label: "Python Generators - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/generators-in-python/",
        },
      ],
    },
  },
  // Excel Module
  {
    id: "excel_basics",
    imageSrc: ExampleImage,
    title: "Excel Grundlagen",
    progress: 90,
    content: {
      videoUrl: "https://www.youtube.com/embed/0nbkaYsR94c",
      title: "Excel für Einsteiger",
      description:
        "Lernen Sie die grundlegenden Funktionen und Formeln in Excel.",
      supplementaryTitle: "Weiterführende Ressourcen",
      supplementaryContent: [
        {
          label: "Excel Funktionen Übersicht - Exceljet",
          url: "https://exceljet.net/excel-functions",
        },
        {
          label: "Excel Tutorials - Microsoft Support",
          url: "https://support.microsoft.com/de-de/excel",
        },
      ],
    },
  },
  {
    id: "excel_advanced",
    imageSrc: ExampleImage,
    title: "Fortgeschrittenes Excel",
    progress: 60,
    content: {
      videoUrl: "https://www.youtube.com/embed/9NUjHBNWe9M",
      title: "Excel Pivot-Tabellen und -Diagramme",
      description:
        "Meistern Sie Pivot-Tabellen und -Diagramme für erweiterte Datenanalysen.",
      supplementaryTitle: "Weiterführende Ressourcen",
      supplementaryContent: [
        {
          label: "Pivot-Tabellen in Excel - Excel Easy",
          url: "https://www.excel-easy.com/data-analysis/pivot-tables.html",
        },
        {
          label: "Erweiterte Excel-Techniken - Udemy Kurs",
          url: "https://www.udemy.com/course/advanced-excel-techniques/",
        },
      ],
    },
  },
  // Power BI Module
  {
    id: "powerbi_intro",
    imageSrc: ExampleImage,
    title: "Einführung in Power BI",
    progress: 80,
    content: {
      videoUrl: "https://www.youtube.com/embed/AGrl-H87pRU",
      title: "Power BI für Anfänger",
      description:
        "Erfahren Sie, wie Sie mit Power BI interaktive Berichte erstellen.",
      supplementaryTitle: "Weiterführende Ressourcen",
      supplementaryContent: [
        {
          label: "Power BI Lernressourcen - Microsoft",
          url: "https://docs.microsoft.com/de-de/power-bi/guided-learning/",
        },
        {
          label: "Power BI Tutorials - SQLBI",
          url: "https://www.sqlbi.com/guides/powerbi/",
        },
      ],
    },
  },
  {
    id: "powerbi_advanced",
    imageSrc: ExampleImage,
    title: "Fortgeschrittenes Power BI",
    progress: 50,
    content: {
      videoUrl: "https://www.youtube.com/embed/lVx4nbDmz1w",
      title: "DAX und Datenmodellierung in Power BI",
      description: "Vertiefen Sie Ihr Wissen in DAX und der Datenmodellierung.",
      supplementaryTitle: "Weiterführende Ressourcen",
      supplementaryContent: [
        {
          label: "DAX Grundlagen - SQLBI",
          url: "https://www.sqlbi.com/articles/dax-basics-in-power-bi/",
        },
        {
          label: "Datenmodellierung in Power BI - RADACAD",
          url: "https://radacad.com/data-modeling-in-power-bi",
        },
      ],
    },
  },
  // SQL Module
  {
    id: "sql_basics",
    imageSrc: ExampleImage,
    title: "SQL Grundlagen",
    progress: 85,
    content: {
      videoUrl: "https://www.youtube.com/embed/7S_tz1z_5bA",
      title: "SQL für Einsteiger",
      description: "Lernen Sie die Grundlagen von SQL und der Datenabfrage.",
      supplementaryTitle: "Weiterführende Ressourcen",
      supplementaryContent: [
        {
          label: "W3Schools SQL Tutorial",
          url: "https://www.w3schools.com/sql/",
        },
        {
          label: "SQL Tutorial - Tutorialspoint",
          url: "https://www.tutorialspoint.com/sql/index.htm",
        },
      ],
    },
  },
  {
    id: "sql_advanced",
    imageSrc: ExampleImage,
    title: "Fortgeschrittenes SQL",
    progress: 70,
    content: {
      videoUrl: "https://www.youtube.com/embed/p3qvj9hO_Bo",
      title: "Komplexe Abfragen und Optimierung",
      description:
        "Erlernen Sie fortgeschrittene Techniken für komplexe SQL-Abfragen.",
      supplementaryTitle: "Weiterführende Ressourcen",
      supplementaryContent: [
        {
          label: "Advanced SQL Tutorials - Mode Analytics",
          url: "https://mode.com/sql-tutorial/advanced-sql/",
        },
        {
          label: "SQL Performance Tuning - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/sql-performance-tuning/",
        },
      ],
    },
  },
];

export default modulesObj;

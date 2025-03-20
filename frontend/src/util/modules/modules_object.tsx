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
    tasks: [
      {
        id: "task1",
        title: "Hello World Programm",
        description: "Schreiben Sie ein Programm, das 'Hello, World!' ausgibt.",
      },
      {
        id: "task2",
        title: "Einfache Berechnungen",
        description: "Erstellen Sie ein Programm, das zwei Zahlen addiert.",
      },
      {
        id: "task3",
        title: "Hello World Programm",
        description: "Schreiben Sie ein Programm, das 'Hello, World!' ausgibt.",
      },
      {
        id: "task4",
        title: "Einfache Berechnungen",
        description: "Erstellen Sie ein Programm, das zwei Zahlen addiert.",
      },
    ],
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
    tasks: [
      {
        id: "task1",
        title: "Dekoratoren implementieren",
        description: "Erstellen Sie einen eigenen Dekorator in Python.",
      },
      {
        id: "task2",
        title: "Generatoren anwenden",
        description: "Schreiben Sie eine Funktion, die Generatoren nutzt.",
      },
    ],
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
    tasks: [
      {
        id: "task1",
        title: "Basisformeln anwenden",
        description: "Erstellen Sie Tabellen mit grundlegenden Formeln.",
      },
      {
        id: "task2",
        title: "Diagramme erstellen",
        description: "Visualisieren Sie Daten mit verschiedenen Diagrammtypen.",
      },
    ],
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
    tasks: [
      {
        id: "task1",
        title: "Pivot-Tabelle erstellen",
        description: "Erstellen Sie eine Pivot-Tabelle mit einem Datensatz.",
      },
      {
        id: "task2",
        title: "Datenanalyse durchführen",
        description:
          "Analysieren Sie komplexe Datensätze mithilfe von Excel-Tools.",
      },
    ],
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
    tasks: [
      {
        id: "task1",
        title: "Bericht erstellen",
        description: "Erstellen Sie einen interaktiven Bericht in Power BI.",
      },
      {
        id: "task2",
        title: "Datenmodellierung",
        description:
          "Modellieren Sie Daten und erstellen Sie Beziehungen zwischen Tabellen.",
      },
    ],
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
    tasks: [
      {
        id: "task1",
        title: "DAX Formeln schreiben",
        description:
          "Schreiben Sie DAX Formeln zur Berechnung komplexer Kennzahlen.",
      },
      {
        id: "task2",
        title: "Erweiterte Datenmodellierung",
        description: "Erstellen Sie ein optimiertes Datenmodell in Power BI.",
      },
    ],
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
    tasks: [
      {
        id: "task1",
        title: "Grundlegende SELECT-Abfrage",
        description: "Schreiben Sie eine einfache SELECT-Abfrage.",
      },
      {
        id: "task2",
        title: "Daten filtern",
        description: "Verwenden Sie WHERE-Klauseln, um Daten zu filtern.",
      },
    ],
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
    tasks: [
      {
        id: "task1",
        title: "Komplexe Joins",
        description: "Erstellen Sie Abfragen mit mehreren Joins.",
      },
      {
        id: "task2",
        title: "Index-Optimierung",
        description: "Optimieren Sie Abfragen durch den Einsatz von Indizes.",
      },
    ],
  },
];

export default modulesObj;

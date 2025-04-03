// pages/Modules.tsx

const modulesObj = [
  // Python Module
  {
    id: "javascript_essentials",
    title: "JavaScript Grundlagen",
    progress: 20,
    content: [
      {
        contentId: "1",
        videoUrl: "https://www.youtube.com/embed/hdI2bqOjy3c",
        title: "Einführung in JavaScript",
        description: "Lerne die Basis von Variablen, Funktionen und mehr.",
        supplementaryTitle: "Lesestoff",
        supplementaryContent: [
          {
            label: "JavaScript Guide (MDN)",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
          },
        ],
      },
      {
        contentId: "2",
        videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
        title: "JS Variablen und Datentypen",
        description: "Unterschied zwischen var, let und const.",
        supplementaryTitle: "Erklärung",
        supplementaryContent: [
          {
            label: "Let vs Const",
            url: "https://wesbos.com/javascript/02-let-const",
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task1",
        title: "Zähler mit JS",
        description: "Erstelle einen Klickzähler in HTML und JS.",
      },
      {
        id: "task2",
        title: "Taschenrechner bauen",
        description: "Programmiere einen kleinen JS-Taschenrechner.",
      },
    ],
  },

  {
    id: "data_science_intro",
    title: "Einführung in Data Science",
    progress: 10,
    content: [
      {
        contentId: "1",
        videoUrl: "https://www.youtube.com/embed/X3paOmcrTjQ",
        title: "Was ist Data Science?",
        description: "Einführung in das Feld der Datenanalyse und Modelle.",
        supplementaryTitle: "Lesen",
        supplementaryContent: [
          {
            label: "Kaggle Start Guide",
            url: "https://www.kaggle.com/learn/overview",
          },
        ],
      },
      {
        contentId: "2",
        videoUrl: "https://www.youtube.com/embed/RaC3fBtfDUc",
        title: "Numpy Crashkurs",
        description: "Grundlagen der Datenanalyse mit Numpy.",
        supplementaryTitle: "Numpy Ressourcen",
        supplementaryContent: [
          {
            label: "Numpy Docs",
            url: "https://numpy.org/doc/",
          },
        ],
      },
      {
        contentId: "3",
        videoUrl: "https://www.youtube.com/embed/0oTh1CXRaQ0",
        title: "Datenvisualisierung mit Matplotlib",
        description: "Diagramme und Plots in Python erstellen.",
        supplementaryTitle: "Matplotlib Docs",
        supplementaryContent: [
          {
            label: "Matplotlib Gallery",
            url: "https://matplotlib.org/stable/gallery/index.html",
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task1",
        title: "Datensatz analysieren",
        description: "Analysiere CSV-Daten mit Pandas.",
      },
      {
        id: "task2",
        title: "Diagramm erstellen",
        description: "Zeichne einen Plot mit Matplotlib.",
      },
    ],
  },
  {
    id: "frontend_basics",
    title: "Frontend Grundlagen",
    progress: 20,
    content: [
      {
        contentId: "1",
        videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE",
        title: "HTML Basics",
        description: "Lerne die grundlegende Struktur einer Webseite.",
      },
    ],
    tasks: [
      {
        id: "task1",
        title: "HTML Grundgerüst erstellen",
        description: "Baue ein Grundgerüst für eine Webseite mit HTML.",
      },
    ],
  },
  {
    id: "css_layouts",
    title: "CSS Layouts",
    progress: 30,
    content: [
      {
        contentId: "1",
        videoUrl: "https://www.youtube.com/embed/1Rs2ND1ryYc",
        title: "CSS Box Model & Flexbox",
        description:
          "Erfahre, wie das Box Model funktioniert und wie du Flexbox nutzen kannst.",
      },
    ],
    tasks: [
      {
        id: "task1",
        title: "Flexbox-Layout erstellen",
        description: "Nutze Flexbox, um eine einfache Navigation zu layouten.",
      },
    ],
  },
  {
    id: "javascript_fundamentals",
    title: "JavaScript Grundlagen",
    progress: 15,
    content: [
      {
        contentId: "1",
        videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
        title: "JavaScript Basics",
        description: "Lerne Variablen, Funktionen und Schleifen in JS kennen.",
      },
    ],
    tasks: [
      {
        id: "task1",
        title: "Einfache Interaktionen",
        description: "Füge interaktive Elemente mit JavaScript hinzu.",
      },
    ],
  },
  {
    id: "version_control",
    title: "Version Control mit Git",
    progress: 40,
    content: [
      {
        contentId: "1",
        videoUrl: "https://www.youtube.com/embed/RGOj5yH7evk",
        title: "Einführung in Git",
        description: "Lerne die Grundlagen von Versionskontrolle und Git.",
      },
    ],
    tasks: [
      {
        id: "task1",
        title: "Git Repository erstellen",
        description:
          "Initialisiere ein neues Git Repository und mache erste Commits.",
      },
    ],
  },
  {
    id: "data_analysis",
    title: "Datenanalyse mit Python",
    progress: 50,
    content: [
      {
        contentId: "1",
        videoUrl: "https://www.youtube.com/embed/X3paOmcrTjQ",
        title: "Grundlagen der Datenanalyse",
        description: "Einführung in Datenanalyse mit Pandas und NumPy.",
      },
    ],
    tasks: [
      {
        id: "task1",
        title: "Einfaches DataFrame erstellen",
        description:
          "Erstelle ein DataFrame mit Pandas und analysiere die Daten.",
      },
    ],
  },
  {
    id: "api_basics",
    title: "API Grundlagen",
    progress: 35,
    content: [
      {
        contentId: "1",
        videoUrl: "https://www.youtube.com/embed/-MTSQjw5DrM",
        title: "Was sind APIs?",
        description:
          "Erfahre, wie APIs funktionieren und wie du sie nutzen kannst.",
      },
    ],
    tasks: [
      {
        id: "task1",
        title: "Eine API-Anfrage stellen",
        description:
          "Rufe Daten von einer öffentlichen API ab und zeige sie an.",
      },
    ],
  },
  {
    id: "python_basics",
    title: "Python Grundlagen",
    progress: 100,
    content: [
      {
        contentId: "1",
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
      {
        contentId: "2",
        videoUrl: "https://www.youtube.com/embed/HGOBQPFzWKo",
        title: "Python Pandas und Numpy",
        description:
          "Vertiefen Sie Ihr Wissen in Python mit fortgeschrittenen Themen bezüglich Pandas und Numpy.",
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
    ],
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
    title: "Fortgeschrittenes Python",
    progress: 75,
    content: [
      {
        contentId: "1",
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
      {
        contentId: "2",
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
    ],
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
  {
    id: "webdev_intro",
    title: "Einführung in Webentwicklung",
    progress: 30,
    content: [
      {
        contentId: "1",
        videoUrl: "https://www.youtube.com/embed/pQN-pnXPaVg",
        title: "Was ist HTML, CSS und JS?",
        description: "Ein Überblick über die Grundlagen der Webentwicklung.",
        supplementaryTitle: "Dokumentationen",
        supplementaryContent: [
          { label: "MDN Web Docs", url: "https://developer.mozilla.org/" },
          { label: "W3Schools", url: "https://www.w3schools.com/" },
        ],
      },
      {
        contentId: "2",
        videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE",
        title: "Erste Website mit HTML",
        description: "Lerne, wie man einfache HTML-Seiten aufbaut.",
        supplementaryTitle: "Beispiele",
        supplementaryContent: [
          {
            label: "HTML Boilerplate",
            url: "https://html5boilerplate.com/",
          },
        ],
      },
      {
        contentId: "3",
        videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI",
        title: "CSS Grundlagen",
        description: "Verstehe, wie Stylesheets dein Layout verändern.",
        supplementaryTitle: "Ressourcen",
        supplementaryContent: [
          {
            label: "CSS Reference",
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task1",
        title: "HTML Grundgerüst bauen",
        description: "Erstelle eine HTML-Seite mit Überschrift und Text.",
      },
      {
        id: "task2",
        title: "CSS anwenden",
        description: "Style deine HTML-Seite mit Farbe und Schrift.",
      },
    ],
  },
];

export default modulesObj;

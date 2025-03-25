import React, { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";

interface CodeEditorBasicProps {
  initialValue?: string;
  onChange: (newCode: string) => void;
  className?: string;
}

const CodeEditorBasic: React.FC<CodeEditorBasicProps> = ({
  initialValue = "",
  onChange,
  className,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  useEffect(() => {
    monaco.editor.defineTheme("orangeTheme", {
      base: "vs",
      inherit: true,
      rules: [{ token: "", foreground: "000000", background: "ffe7d4" }],
      colors: {
        "editor.background": "#ffe7d4", // Leicht oranger Hintergrund
        "editor.foreground": "#000000",
        "editorCursor.foreground": "#ff863d",
        "editor.lineHighlightBackground": "#FFECB3",
        "editorLineNumber.foreground": "#ff863d",
        "editor.selectionBackground": "#FFD180",
        "editor.inactiveSelectionBackground": "#FFE0B2",
      },
    });

    if (editorRef.current) {
      editorInstance.current = monaco.editor.create(editorRef.current, {
        value: initialValue,
        language: "python",
        theme: "orangeTheme", // Verwende das benutzerdefinierte, oranger Theme
        automaticLayout: true,
        fontSize: 16,
        fontFamily: 'Fira Code, Consolas, "Courier New", monospace',
        wordWrap: "on", // Automatischer Zeilenumbruch
        minimap: { enabled: false }, // Minimap deaktivieren für ein cleanes Layout
        smoothScrolling: true, // Weiches Scrollen
        scrollBeyondLastLine: false,
        renderLineHighlight: "all", // Hebt die gesamte Zeile hervor
        roundedSelection: true,
        folding: true,
        renderWhitespace: "all",
      });

      const subscription = editorInstance.current.onDidChangeModelContent(
        () => {
          const currentCode = editorInstance.current?.getValue() || "";
          onChange(currentCode);
        }
      );

      return () => {
        subscription.dispose();
        editorInstance.current?.dispose();
      };
    }
  }, []); // Nur einmal initialisieren

  return (
    <div
      style={{
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
        overflow: "hidden",
      }}
      className={`${className}`}
      ref={editorRef}
    ></div>
  );
};

export default CodeEditorBasic;

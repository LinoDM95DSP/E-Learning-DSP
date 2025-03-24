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
    if (editorRef.current) {
      editorInstance.current = monaco.editor.create(editorRef.current, {
        value: initialValue,
        language: "python",
        theme: "vs-light",
        automaticLayout: true,
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

  return <div className={className} ref={editorRef}></div>;
};

export default CodeEditorBasic;

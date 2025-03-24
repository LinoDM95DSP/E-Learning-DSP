import React, { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";

type CodeEditorBasicProps = {
  initialValue?: string;
  onChange: (newCode: string) => void;
};

const CodeEditorBasic: React.FC<CodeEditorBasicProps> = ({
  initialValue = "",
  onChange,
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
        theme: "vs-dark",
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

  return (
    <div
      ref={editorRef}
      style={{ width: "600px", height: "600px", border: "1px solid #ccc" }}
    ></div>
  );
};

export default CodeEditorBasic;

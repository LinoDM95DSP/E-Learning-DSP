// CodeEditorWithOutput.tsx
import React, { useState, useImperativeHandle, forwardRef } from "react";
import CodeEditorBasic from "./code_editor_basic";
import { api } from "../../../util/apis/initial_api";

interface Code {
  code: string;
}

export interface CodeEditorWithOutputHandle {
  handleRunCode: () => void;
}

interface CodeEditorWithOutputProps {}

const CodeEditorWithOutput = forwardRef<
  CodeEditorWithOutputHandle,
  CodeEditorWithOutputProps
>((props, ref) => {
  const [initialCode, setInitialCode] = useState(
    "# Schreibe hier deinen Code rein..."
  );
  const [output, setOutput] = useState("");

  const handleRunCode = () => {
    const userCode: Code = { code: initialCode };
    console.log("userCode:", userCode);
    api
      .post<{ code: string }>("/code_editor/execute_python_code/", userCode)
      .then((response) => {
        console.log("code executed:", response);
        setOutput(response.code);
      })
      .catch((error) => console.error("Error code execution:", error));
  };

  useImperativeHandle(ref, () => ({
    handleRunCode,
  }));

  return (
    <div className=" w-full h-full rounded-lg shadow-sm">
      <div className="flex rounded-md bg-dsp-orange_light">
        <CodeEditorBasic
          className="w-1/2 h-[600px]"
          initialValue={initialCode}
          onChange={setInitialCode}
        />

        <div className="w-1/2 h-[600px] overflow-y-auto p-4 border-l-2 border-gray-300">
          <h3>Output:</h3>
          <pre className="whitespace-pre-wrap break-all">{output}</pre>
        </div>
      </div>
    </div>
  );
});

export default CodeEditorWithOutput;

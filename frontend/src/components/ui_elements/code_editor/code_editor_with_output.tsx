// CodeEditorWithOutput.tsx
import React, { useState } from "react";
import CodeEditorBasic from "./code_editor_basic";
import { api } from "../../../util/apis/initial_api";
import ButtonPrimary from "../buttons/button_primary";

interface Code {
  code: string;
}

const CodeEditorWithOutput: React.FC = () => {
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

  return (
    <div className="w-full h-full rounded-lg bg-white p-6 border border-gray-300  ">
      <div className="flex justify-between items-center mb-4">
        <h1>Code-Editor</h1>
        <ButtonPrimary title="Code ausführen" onClick={handleRunCode} />
      </div>
      <div className="flex rounded-md bg-white gap-5 ">
        <CodeEditorBasic
          className="w-1/2 h-[600px] rounded-lg border border-gray-400"
          initialValue={initialCode}
          onChange={setInitialCode}
        />

        <div className="w-1/2 h-[600px] overflow-y-auto p-4 border border-gray-400 bg-dsp-orange_light rounded-lg">
          <h3>Output:</h3>
          <pre className="whitespace-pre-wrap break-all">{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorWithOutput;

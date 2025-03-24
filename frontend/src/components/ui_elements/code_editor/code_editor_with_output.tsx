import React, { useState } from "react";
import CodeEditorBasic from "./code_editor_basic";
import { api } from "../../../util/apis/initial_api";

interface Code {
  code: string;
}

const CodeEditorWithOutput: React.FC = () => {
  const [initialCode, setInitialCode] = useState(
    "# Schreibe hier dein Code rein..."
  );
  const [output, setOutput] = useState("");

  const handleRunCode = () => {
    const userCode: Code = {
      code: initialCode,
    };
    console.log("userCode:", userCode);
    api
      .post<Code>("/code_editor/execute_python_code/", userCode)

      .then((response) => {
        console.log("code executed:", response);

        setOutput(response.code);
      })
      .catch((error) => console.error("Error code execution:", error));
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center border-1 border-dsp-orange rounded-md bg-gray-100">
        <CodeEditorBasic
          className="w-1/2 h-[500px]"
          initialValue={`${initialCode}`}
          onChange={setInitialCode}
        />

        <div className="">
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      </div>
      <button
        className="hover:cursor-pointer border-1 p-1"
        onClick={handleRunCode}
        style={{ marginTop: "1rem" }}
      >
        Code ausführen
      </button>
    </div>
  );
};

export default CodeEditorWithOutput;

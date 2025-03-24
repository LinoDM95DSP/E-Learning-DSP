import React, { useState } from "react";
import CodeEditorBasic from "./code_editor_basic";
import { api } from "../../../util/apis/initial_api";

interface Code {
  code: string;
}

const CodeEditorWithOutput: React.FC = () => {
  const [initialCode, setInitialCode] = useState("");
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
    <div>
      <div className="flex items-center">
        <CodeEditorBasic
          initialValue={`${initialCode}`}
          onChange={setInitialCode}
        />

        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            width: "600px",
            height: "600px",
          }}
        >
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

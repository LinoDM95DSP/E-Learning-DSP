// CodeEditorWithOutput.tsx
import React, { useState, useRef } from "react";
import CodeEditorBasic from "./code_editor_basic";
import type { CodeEditorBasicHandle } from "./code_editor_basic";
import { api } from "../../../util/apis/initial_api";
import ButtonPrimary from "../buttons/button_primary";
import ButtonSecondary from "../buttons/button_secondary";
import { IoChevronDown, IoChevronUp, IoRefresh } from "react-icons/io5";
import { motion, useAnimation } from "framer-motion";

interface Code {
  code: string;
}

const CodeEditorWithOutput: React.FC = () => {
  const defaultCode = "# Schreibe hier deinen Code rein...";
  const [currentCode, setCurrentCode] = useState<string>(defaultCode);
  const [output, setOutput] = useState<string>("");
  const [isOutputVisible, setIsOutputVisible] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const editorBasicRef = useRef<CodeEditorBasicHandle>(null);
  const resetIconControls = useAnimation();

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("Code wird ausgeführt...");
    const userCode: Code = { code: currentCode };
    api
      .post<{ code: string }>("/code_editor/execute_python_code/", userCode)
      .then((response) => {
        setOutput(response.code);
        setIsOutputVisible(true);
      })
      .catch((error) => {
        console.error("Error code execution:", error);
        setOutput(
          `Fehler bei der Ausführung:\n${
            error?.response?.data?.code || error.message || "Unbekannter Fehler"
          }`
        );
        setIsOutputVisible(true);
      })
      .finally(() => {
        setIsRunning(false);
      });
  };

  const handleResetCode = () => {
    setCurrentCode(defaultCode);
    editorBasicRef.current?.setValue(defaultCode);
    setOutput("");
  };

  const handleResetHoverStart = () => {
    resetIconControls.start({
      rotate: 360,
      transition: { duration: 0.4, ease: "easeInOut" },
    });
  };

  const handleResetHoverEnd = () => {
    resetIconControls.start({
      rotate: 0,
      transition: { duration: 0 },
    });
  };

  return (
    <div className="w-full h-full flex flex-col rounded-lg bg-white p-6 border border-gray-300 shadow-sm gap-4">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
        <h1 className="text-lg font-semibold">Code-Editor</h1>
        <div className="flex gap-3">
          <ButtonSecondary
            title="Zurücksetzen"
            icon={
              <motion.span
                style={{ display: "inline-block" }}
                animate={resetIconControls}
              >
                <IoRefresh size={18} />
              </motion.span>
            }
            onClick={handleResetCode}
            onHoverStart={handleResetHoverStart}
            onHoverEnd={handleResetHoverEnd}
            classNameButton="text-xs px-3 py-1"
            iconPosition="left"
          />
          <ButtonPrimary
            title={isRunning ? "Wird ausgeführt..." : "Code ausführen"}
            onClick={handleRunCode}
            disabled={isRunning}
            classNameButton="text-xs px-3 py-1"
          />
        </div>
      </div>
      <div className="flex-grow min-h-[200px]">
        <CodeEditorBasic
          ref={editorBasicRef}
          className="w-full h-full rounded-lg border border-gray-300 overflow-hidden"
          initialValue={currentCode}
          onChange={setCurrentCode}
        />
      </div>
      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-semibold">Output</h3>
          <button
            onClick={() => setIsOutputVisible(!isOutputVisible)}
            className="p-1 rounded hover:bg-gray-100 text-gray-500"
            aria-label={
              isOutputVisible ? "Output ausblenden" : "Output einblenden"
            }
          >
            {isOutputVisible ? (
              <IoChevronUp size={20} />
            ) : (
              <IoChevronDown size={20} />
            )}
          </button>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isOutputVisible ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="max-h-[200px] overflow-y-auto h-auto p-3 border border-gray-300 bg-gray-50 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap break-words">
              {output || " "}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorWithOutput;

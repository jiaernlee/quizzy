import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

interface AddQuestionProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    question: string,
    options: string[],
    answer: string[],
    type: "single" | "multiple"
  ) => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [type, setType] = useState<"single" | "multiple">("single");
  const [error, setError] = useState<string | null>(null);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleDeleteOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);

    if (type === "single" && answers.includes(options[index])) {
      setAnswers([]);
    } else if (type === "multiple") {
      setAnswers(answers.filter((answer) => answer !== options[index]));
    }
  };

  const handleAnswerChange = (option: string) => {
    if (type === "single") {
      setAnswers([option]);
    } else if (type === "multiple") {
      setAnswers((prev) =>
        prev.includes(option)
          ? prev.filter((ans) => ans !== option)
          : [...prev, option]
      );
    }
  };

  const handleSave = () => {
    if (options.length === 0 || answers.length === 0) {
      setError("Please add options and select the correct one(s).");
      return;
    }

    const notEmptyOptions = options.filter((option) => option.trim() !== "");
    if (notEmptyOptions.length === 0) {
      setError("Options cannot be empty.");
      return;
    }

    onSave(question, options, answers, type);
    setError(null);
    setQuestion("");
    setOptions([""]);
    setAnswers([]);
    setType("single");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add a question</h2>
        <div className="mb-4">
          <label className="block mb-2">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Question Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "single" | "multiple")}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="single">Single Answer</option>
            <option value="multiple">Multiple Answers</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Options</label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <button
                className="text-[#F44336] me-2"
                onClick={() => handleDeleteOption(index)}
              >
                <AiFillCloseCircle />
              </button>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
              <input
                type={type === "single" ? "radio" : "checkbox"}
                checked={answers.includes(option)}
                onChange={() => handleAnswerChange(option)}
                className="ml-2"
              />
              <label className="ml-2">
                {type === "single" ? "Correct" : "Select"}
              </label>
            </div>
          ))}
          <button
            onClick={handleAddOption}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Add Option
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;

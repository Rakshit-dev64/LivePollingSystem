import React, { useEffect, useMemo, useState } from "react";
import { createSocketConnection } from "../utils/socket";
import ChatPanel from "./SubComponents/ChatPanel";
import ChatButton from "./SubComponents/ChatButton";
import NameInputScreen from "./SubComponents/NameInputScreen";

const Teacher = () => {
  const confirmedName = sessionStorage.getItem("name");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
    { id: 3, text: "", isCorrect: false },
    { id: 4, text: "", isCorrect: false },
  ]);
  const [timeLimit, setTimeLimit] = useState("30");
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const socket = useMemo(() => createSocketConnection(), []);

  useEffect(() => {
    if (confirmedName) {
      socket.emit("teacher_registered", confirmedName);
    }
    socket.on("connect", () => {
      console.log("Teacher connected: ", socket.id);
    });
    socket.on("question_exist", () => {
      console.error("question already exists");
    });

    socket.on("current_submissions", (currentSubmissions) => {
      setSubmissions(currentSubmissions);
    });

    socket.on("quiz_results", ({ submissions: finalSubmissions }) => {
      setSubmissions(finalSubmissions);
    });

    socket.on("students", (students) => {
      console.log(students);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOptionChange = (id, value) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, text: value } : opt))
    );
  };

  const handleCorrectChange = (id, value) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, isCorrect: value } : opt))
    );
  };

  const handleViewResults = () => {
    socket.emit("get_current_submissions");
    setShowResultsModal(true);
  };

  const handleAskQuestion = () => {
    socket.emit("send_question", {
      question,
      options,
      timeLimit: parseInt(timeLimit),
    });
  };
  if (!confirmedName) return <NameInputScreen role="teacher" />;
  return (
    <div className="flex min-h-screen items-start justify-start md:py-0">
      <div className=" flex flex-col w-4xl max-w-full mt-12 ml-30">
        <div className="border text-center  w-46 md:w-46 p-2 font-stretch-110% mb-1 rounded-4xl text-[#F2F2F2] bg-gradient-to-tr from-[#7565D9] to-[#4D0ACD] text-lg md:text-xl">
          ✨Intervue Poll
        </div>
        <div className="flex flex-col items-start justify-start">
          <h1 className="font-light font-stretch-110% text-2xl md:text-4xl leading-tight">
            Let's <span className="font-semibold">Get Started</span>
          </h1>
          <p className="font-light text-gray-500 font-stretch-120% text-md">
            you have the ability to create and manage polls, ask questions, and
            monitor your students' responses in real-time.
          </p>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2 mt-4">
            <div className="h-8 flex justify-items-start font-stretch-110% font-semibold text-xl">
              Enter your question
            </div>
            <div className="relative">
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="bg-gray-200 px-4 py-2 rounded-lg font-stretch-110% appearance-none pr-8 border-0 focus:outline-none"
              >
                <option value="30">30 seconds</option>
                <option value="60">60 seconds</option>
                <option value="90">90 seconds</option>
                <option value="120">120 seconds</option>
              </select>

              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask Questions to the connected students"
            className="w-full h-32 bg-gray-200 focus:outline-none focus:ring-0 p-4 text-lg font-stretch-110% resize-none rounded-lg border-0"
          ></textarea>
        </div>

        {/* Edit Options Section */}
        <div className="mt-4">
          <div className="flex space-x-80 items-start mb-4">
            <h3 className="font-stretch-110% font-semibold text-xl">
              Edit Options
            </h3>
            <h3 className="font-stretch-110% font-semibold text-xl">
              Is it Correct?
            </h3>
          </div>

          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-20">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#4F0DCE] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {option.id}
                  </div>
                  <input
                    placeholder={`Option ${option.id}`}
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(option.id, e.target.value)
                    }
                    className="bg-gray-200 px-4 py-3 rounded-lg font-stretch-110% w-80 focus:outline-none focus:ring-0 border-0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`correct-${option.id}`}
                    checked={option.isCorrect === true}
                    onChange={() => handleCorrectChange(option.id, true)}
                    className="w-5 h-5 accent-[#7565D9]"
                  />
                  <label>Yes</label>
                  <input
                    type="radio"
                    name={`correct-${option.id}`}
                    checked={option.isCorrect === false}
                    onChange={() => handleCorrectChange(option.id, false)}
                    className="w-5 h-5 accent-[#7565D9]"
                  />
                  <label>No</label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-x-4">
          <div className="">
            <button
              onClick={handleAskQuestion}
              className="bg-gradient-to-tr from-[#7565D9] to-[#4D0ACD] text-white font-stretch-110% font-semibold px-8 py-3 rounded-lg text-lg hover:opacity-90 transition-opacity"
            >
              Ask Question
            </button>
          </div>
           {/* View Results Button */}
        <button
          onClick={handleViewResults}
          className="bg-gradient-to-tr from-[#7565D9] to-[#4D0ACD] text-white font-stretch-110% font-semibold px-8 py-3 rounded-lg text-lg hover:opacity-90 transition-opacity"
        >
          View Results
        </button>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        {/* Chat Button */}
        <button
          onClick={() => setShowChatPanel(true)}
          className="fixed bottom-6 right-6 bg-white border-2 border-[#7565D9] text-[#7565D9] font-semibold p-3 rounded-full hover:bg-[#7565D9] hover:text-white transition-all shadow-lg z-40"
          title="Open Chat"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1h.1c.3 0 .6-.1.8-.3L14.6 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12H7v-2h6v2zm3-4H7V8h9v2z" />
          </svg>
        </button>
      </div>

      {/* Results */}
      {showResultsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Quiz Submissions
              </h2>
              <button
                onClick={() => setShowResultsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No submissions yet</p>
                <p className="text-sm">
                  Submissions will appear here as students answer
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                        Student Name
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                        Selected Option
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="border border-gray-300 px-4 py-3">
                          {sub.studentName}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          Option {sub.selectedOption}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              sub.isCorrect
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {sub.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowResultsModal(false)}
                className="bg-gradient-to-tr from-[#7565D9] to-[#4D0ACD] text-white font-stretch-110% font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      <ChatPanel
        isOpen={showChatPanel}
        onClose={() => setShowChatPanel(false)}
        socket={socket}
        name={confirmedName}
      />
    </div>
  );
};

export default Teacher;

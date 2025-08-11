import React, { useEffect, useMemo, useState } from "react";
import { createSocketConnection } from "../utils/socket";

const Teacher = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
    { id: 3, text: "", isCorrect: false },
    { id: 4, text: "", isCorrect: false },
  ]);
  const [timeLimit, setTimeLimit] = useState("30");
  const socket = useMemo(() => createSocketConnection(), []);

  useEffect(() => {
      socket.on("connect", () => {
        console.log("Teacher connected: ", socket.id);
      });
      socket.on("question_exist",()=>{
        console.error("question already exists");
      })
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


  const handleAskQuestion = () => {
    socket.emit("send_question", { question, options, timeLimit });
  };

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

        {/* Ask Question Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleAskQuestion}
            className="bg-gradient-to-tr from-[#7565D9] to-[#4D0ACD] text-white font-stretch-110% font-semibold px-8 py-3 rounded-lg text-lg hover:opacity-90 transition-opacity"
          >
            Ask Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teacher;

import { useEffect, useMemo, useState } from "react";
import NameInputScreen from "./SubComponents/NameInputScreen";
import WaitingScreen from "./SubComponents/WaitingScreen";
import ChatPanel from "./SubComponents/ChatPanel";
import ChatButton from "./SubComponents/ChatButton";
import { createSocketConnection } from "../utils/socket";

const Student = () => {
  const confirmedName = sessionStorage.getItem("name");
  const socket = useMemo(() => createSocketConnection(), []);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [correctOptionId, setCorrectOptionId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  useEffect(() => {
    if (confirmedName && !hasRegistered) {
      socket.emit("student_registered", confirmedName);
      setHasRegistered(true);
    }
    if (!confirmedName) {
    setHasRegistered(false);
    } 
    socket.on("new_question", (question) => {
      setQuestion(question);
      const now = Date.now();
      const remainingTime = Math.max(0, Math.floor((question.endTime - now) / 1000));
      setTimeLeft(remainingTime);
      setSelectedOption(null);
      setSubmitted(false);
      setCorrectOptionId(null);
    });
    socket.on("quiz_results", ({ correctOptionId }) => {
      setCorrectOptionId(correctOptionId);
    });
  }, [confirmedName, hasRegistered]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      socket.emit("answer_submitted", { selectedOption });
      setSubmitted(true);
      console.log("Answer submitted:", selectedOption);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!confirmedName) return <NameInputScreen role ="student"/>;
  if (!question) return (
    <>
      <WaitingScreen />
      <ChatButton onClick={() => setShowChatPanel(true)} />
      <ChatPanel 
        isOpen={showChatPanel}
        onClose={() => setShowChatPanel(false)}
        socket={socket}
        name={confirmedName}
      />
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8">
        {/* Header with Question number and Timer */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Question</h2>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-red-500 font-mono text-lg font-medium">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="bg-gray-800 text-white p-4 rounded-lg">
            <h3 className="text-lg font-medium">{question.question}</h3>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => {
            let bgClass = "bg-gray-50 border-gray-200 hover:border-gray-300";
            if (correctOptionId && timeLeft == 0) {
              if (option.id === correctOptionId)
                bgClass = "bg-green-100 border-green-500";
              else if (option.id === selectedOption)
                bgClass = "bg-red-100 border-red-500";
            } else if (selectedOption === option.id) {
              bgClass = "bg-purple-50 border-[#7765DA]";
            }
            return (
              <div
                key={option.id}
                onClick={() =>{
                  if(!submitted && timeLeft > 0){
                     handleOptionSelect(option.id)
                  }
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${bgClass}`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      selectedOption === option.id
                        ? "bg-[#4F0DCE]"
                        : "bg-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-gray-800 font-medium">
                    {option.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null || timeLeft === 0 || submitted}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
              selectedOption !== null && timeLeft > 0 && !submitted
                ? "bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] hover:bg-purple-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      </div>
      {submitted && correctOptionId && timeLeft == 0 &&
      <div className="flex justify-center mt-3"> 
        <div className="flex items-center justify-center text-lg font-semibold">Wait for the teacher to ask questions..</div>
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-0 border-[#4D0ACD]"></div> 
      </div>}
      {submitted && (!correctOptionId) &&
      <div className="flex justify-center mt-3"> 
        <div className="flex items-center justify-center text-lg font-semibold">Wait for the result..</div>
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-0 border-[#4D0ACD]"></div> 
      </div>}
      
  {/* Chat Button */}
   <button
          onClick={()=>setShowChatPanel(true)}
          className="fixed bottom-6 right-6 bg-white border-2 border-[#7565D9] text-[#7565D9] font-semibold p-3 rounded-full hover:bg-[#7565D9] hover:text-white transition-all shadow-lg z-40"
          title="Open Chat"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1h.1c.3 0 .6-.1.8-.3L14.6 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12H7v-2h6v2zm3-4H7V8h9v2z" />
          </svg>
        </button>
  
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

export default Student;

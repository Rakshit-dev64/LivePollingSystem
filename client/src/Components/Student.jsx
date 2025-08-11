import { useEffect, useMemo, useState } from "react";
import NameInputScreen from "./SubComponents/NameInputScreen";
import WaitingScreen from "./SubComponents/WaitingScreen";
import { createSocketConnection } from "../utils/socket";

const Student = () => {
  const confirmedName = sessionStorage.getItem("name");
  const socket = useMemo(() => createSocketConnection(), []);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(()=>{
    if(confirmedName){
      socket.emit("student_registered",confirmedName)
    }
    socket.on("new_question",(question)=>{
      console.log(question);
      setQuestion(question);
      setTimeLeft(parseInt(question.timeLimit));
      setSelectedOption(null);
    })
  },[confirmedName])

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
      socket.emit("answer_submitted", {
        questionId: question.id,
        selectedOption: selectedOption,
        studentName: confirmedName
      });
      console.log("Answer submitted:", selectedOption);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  if (!confirmedName) return <NameInputScreen />;
  if(!question) return <WaitingScreen/>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8">
        {/* Header with Question number and Timer */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Question 1</h2>
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
          {question.options.map((option, index) => (
            <div
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedOption === option.id
                  ? 'border-[#7765DA] bg-purple-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  selectedOption === option.id ? 'bg-[#4F0DCE]' : 'bg-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className="text-gray-800 font-medium">{option.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null || timeLeft === 0}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
              selectedOption !== null && timeLeft > 0
                ? 'bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] hover:bg-purple-700 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
};

export default Student;

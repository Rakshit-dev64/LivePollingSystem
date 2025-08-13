import React, { useState } from "react";

const NameInputScreen = ({role}) => {
  const [name, setName] = useState("");
  const handleContinue = () => {
    if (name.trim()) {
      sessionStorage.setItem("name", name);
      window.location.reload();
    }
  };
  let description = "";
  if(role === "student"){
    description = "If you're a student, you'll be able to submit your answers, actively participate in live polls, and easily see if your responses are correct or not."
  }
  if(role === "teacher"){
    description = "If you're a teacher, you'll be able to create engaging questions, manage live polls in real time, and instantly view detailed results from your students."
  }
  return (
    <div className="flex min-h-screen md:h-screen items-center justify-center px-4 py-6 md:py-0">
      <div className="flex flex-col gap-y-6 md:gap-y-8 items-center justify-center text-center w-4xl max-w-full">
        <div className="border w-46 md:w-46 p-2 font-stretch-110% rounded-4xl text-[#F2F2F2] bg-gradient-to-tr from-[#7565D9] to-[#4D0ACD] text-lg md:text-xl">
          ✨Intervue Poll
        </div>
        <div className="px-4">
          <h1 className="font-light font-stretch-110% text-2xl md:text-6xl leading-tight">
            Let's <span className="font-semibold">Get Started</span>
          </h1>
          <p className="font-light text-gray-500 mt-2 md:m-4 font-stretch-120% text-sm md:text-lg">
            {description}
          </p>
        </div>
        <div className="w-lg">
          <div className="h-8 flex justify-items-start font-stretch-120%">
            Enter your Name
          </div>
          <input
            className="w-lg h-11 text-xl bg-gray-200 rounded-md focus:outline-none focus:ring-0 bg- p-2 font-stretch-105%"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <button
          onClick={handleContinue}
          className="w-48 md:w-54 mx-4 my-2 md:m-4 bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-md md:text-2xl font-semibold font-stretch-110% rounded-4xl h-12 md:h-14 text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default NameInputScreen;

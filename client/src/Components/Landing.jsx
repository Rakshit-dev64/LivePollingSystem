import React, { useState } from "react";
import Student from "./Student";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const onClickFunction = (r) => {
    setRole(r);
  };
  const continueFunction = ()=>{
    if(role === "student"){
      navigate("/student")
    }
    else if(role === "teacher"){
      navigate("/teacher")
    }
  }

  return (
    <div className="flex min-h-screen md:h-screen items-center justify-center px-4 py-6 md:py-0">
      <div className="flex flex-col gap-y-6 md:gap-y-10 items-center justify-center text-center w-4xl max-w-full">
        <div className="border w-46 md:w-46 p-2 font-stretch-110% rounded-4xl text-[#F2F2F2] bg-gradient-to-tr from-[#7565D9] to-[#4D0ACD] text-lg md:text-xl">
         ✨Intervue Poll
        </div>
        <div className="px-4">
          <h1 className="font-light font-stretch-110% text-2xl md:text-6xl leading-tight">
            Welcome to the{" "}
            <span className="font-semibold">Live Polling System</span>
          </h1>
          <p className="font-light text-gray-500 m-2 md:m-4 font-stretch-120% text-sm md:text-lg">
            Please select the role that best describes you to begin using the
            live polling system
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-center justify-center w-full max-w-sm md:max-w-none px-4 md:px-0">
          <button
            onClick={() => onClickFunction("student")}
            className={`w-full md:w-80 h-24 md:h-32 rounded-lg flex flex-col items-center justify-center p-3 md:p-6 font-stretch-110% text-base md:text-2xl font-semibold ${role === "student" ? "border-2 border-[#1D68BD]" : "border-2 border-[#D9D9D9]"}`}
          >
            <span>I'm a Student</span>
            <span className="font-light text-gray-500 text-xs md:text-base mt-1 md:mt-2 text-center leading-tight">
              Participate in Polls and test your academic progress.
            </span>
          </button>
          <button
            onClick={() => onClickFunction("teacher")}
            className={`w-full md:w-80 h-24 md:h-32 rounded-lg flex flex-col items-center justify-center p-3 md:p-6 font-stretch-110% text-base md:text-2xl font-semibold ${role === "teacher" ? "border-2 border-[#1D68BD]" : "border-2 border-[#D9D9D9]"}`}
          >
            <span>I'm a Teacher</span>
            <span className="font-light text-gray-500 text-xs md:text-base mt-1 md:mt-2 text-center leading-tight">
              Organize Live polls and view results in real-time.
            </span>
          </button>
        </div>
        <button onClick={continueFunction} className="w-48 md:w-54 mx-4 my-2 md:m-4 bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-md md:text-2xl font-semibold font-stretch-110% rounded-4xl h-12 md:h-14 text-white">
          Continue
        </button>
      </div>
    </div>
  );
};

export default Landing;

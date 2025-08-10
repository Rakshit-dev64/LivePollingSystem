import React from "react";

function WaitingScreen() {
  return (
    <div className="flex min-h-screen md:h-screen items-center justify-center px-4 py-6 md:py-0">
      <div className="flex flex-col gap-y-6 md:gap-y-10 items-center justify-center text-center w-4xl max-w-full">
        <div className="border w-46 md:w-46 p-2 font-stretch-110% rounded-4xl text-[#F2F2F2] bg-gradient-to-tr from-[#7565D9] to-[#4D0ACD] text-lg md:text-xl">
          ✨Intervue Poll
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-0 border-[#4D0ACD]"></div>
      <div className="text-4xl font-semibold font-stretch-110%">Wait for the teacher to ask questions..</div>
      </div>
    </div>
  );
}

export default WaitingScreen;

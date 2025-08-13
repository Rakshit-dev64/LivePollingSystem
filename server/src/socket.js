import { Server } from "socket.io";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  const students = {};
  let currentQuestion = null;
  let submissions = [];
  io.on("connection", (socket) => {
    socket.on("student_registered",(name)=>{
        students[socket.id] = {
            name : name,
        }
        console.log(`Student Joined : ${name} ${socket.id}`);
    })
    socket.emit("students",students);
    socket.on("send_question",({question, options, timeLimit})=>{
      console.log({question, options, timeLimit})
      if(currentQuestion){
        socket.emit("question_exist",{
          message : "A question already exists"
        })
        return;
      }
      const correctOptionId = options.find(o => o.isCorrect)?.id;
      const startTime = Date.now();
      const endTime = startTime + (timeLimit * 1000);
      currentQuestion = {question, options, timeLimit, correctOptionId, startTime, endTime};
      submissions = [];
      io.emit("new_question",currentQuestion);
  
      const timeoutDuration = endTime - Date.now();
      setTimeout(()=>{
        io.emit("quiz_results",{correctOptionId, submissions});
        currentQuestion = null;
      }, timeoutDuration);
    })
    socket.on("answer_submitted",({selectedOption})=>{
      if(!currentQuestion || selectedOption == null) return;
      const isCorrect = selectedOption === currentQuestion.correctOptionId;

      submissions.push({
        studentName: students[socket.id]?.name || "Unknown",
        selectedOption,
        isCorrect
      })
    })
    
    socket.on("get_current_submissions", () => {
      socket.emit("current_submissions", submissions);
    })
  });
};

export default initializeSocket;
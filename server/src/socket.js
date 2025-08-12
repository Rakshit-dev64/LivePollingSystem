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
    socket.on("send_question",({question, options, timeLimit})=>{
      console.log({question, options, timeLimit})
      if(currentQuestion){
        socket.emit("question_exist",{
          message : "A question already exists"
        })
        return;
      }
      const correctOptionId = options.find(o => o.isCorrect)?.id;
      currentQuestion = {question, options, timeLimit, correctOptionId, startTime : Date.now()};
      submissions = [];
      io.emit("new_question",currentQuestion);
  
      setTimeout(()=>{
        io.emit("quiz_results",{correctOptionId, submissions});
        currentQuestion = null;
      },timeLimit * 1000);
    })
    socket.on("answer_submitted",({selectedOption})=>{
      if(selectedOption == null) return;
      const isCorrect = selectedOption === currentQuestion.correctOptionId;

      submissions.push({
        studentName: students[socket.id]?.name || "Unknown",
        selectedOption,
        isCorrect
      })
    })
  });
};

export default initializeSocket;
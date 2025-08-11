import { Server } from "socket.io";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  const students = {};
  let currentQuestion = null;
  io.on("connection", (socket) => {
    socket.on("student_registered",(name)=>{
        students[socket.id] = {
            name : name,
            answered : false
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
      currentQuestion = {question, options, timeLimit, startTime : Date.now()};
      io.emit("new_question",currentQuestion);
  
      setTimeout(()=>{
        currentQuestion = null;
        io.emit("question_ended");
      },timeLimit * 1000);
    })
  });
};

export default initializeSocket;
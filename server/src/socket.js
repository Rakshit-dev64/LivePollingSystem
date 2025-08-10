import { Server } from "socket.io";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  const students = {};
  io.on("connection", (socket) => {
    socket.on("student_registered",(name)=>{
        students[socket.id] = {
            name : name,
            answered : false
        }
        console.log(`Student Joined : ${name} ${socket.id}`);
    })
  });
};

export default initializeSocket;
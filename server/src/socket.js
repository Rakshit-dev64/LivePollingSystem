import { Server } from "socket.io";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  const students = {};
  let teacher = null;
  let currentQuestion = null;
  let submissions = [];
  
  const broadcastParticipants = () => {
    const participants = teacher
      ? [teacher, ...Object.values(students)]
      : Object.values(students);
    io.emit("participants", participants);
  };
  
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    socket.on("student_registered", (name) => {
      students[socket.id] = {
        name: name,
        socketId: socket.id,
        role: 'student'
      };
      console.log(`Student Joined: ${name} ${socket.id}`);
      broadcastParticipants();
    });
    socket.on("teacher_registered", (name) => {
      teacher = { 
        name: name,
        socketId: socket.id,
        role: 'teacher'
      };
      console.log(`Teacher registered: ${name} ${socket.id}`);
      broadcastParticipants();
    });
    socket.emit("students", students);
    socket.on("send_question", ({ question, options, timeLimit }) => {
      console.log({ question, options, timeLimit });
      if (currentQuestion) {
        socket.emit("question_exist", {
          message: "A question already exists",
        });
        return;
      }
      const correctOptionId = options.find((o) => o.isCorrect)?.id;
      const startTime = Date.now();
      const endTime = startTime + timeLimit * 1000;
      currentQuestion = {
        question,
        options,
        timeLimit,
        correctOptionId,
        startTime,
        endTime,
      };
      submissions = [];
      io.emit("new_question", currentQuestion);

      const timeoutDuration = endTime - Date.now();
      setTimeout(() => {
        io.emit("quiz_results", { correctOptionId, submissions });
        currentQuestion = null;
      }, timeoutDuration);
    });
    socket.on("answer_submitted", ({ selectedOption }) => {
      if (!currentQuestion || selectedOption == null) return;
      const isCorrect = selectedOption === currentQuestion.correctOptionId;

      submissions.push({
        studentName: students[socket.id]?.name || "Unknown",
        selectedOption,
        isCorrect,
      });
    });
    
    // Send current participants to newly connected client
    broadcastParticipants();

    socket.on("get_current_submissions", () => {
      socket.emit("current_submissions", submissions);
    });
    
    // Handle disconnections to prevent repeated names
    socket.on("disconnect", () => {
      console.log(`Connection ${socket.id} disconnected`);
      
      // Remove student if they were registered
      if (students[socket.id]) {
        console.log(`Student ${students[socket.id].name} disconnected`);
        delete students[socket.id];
      }
      
      // Clear teacher if this was the teacher connection
      if (teacher && teacher.socketId === socket.id) {
        console.log(`Teacher ${teacher.name} disconnected`);
        teacher = null;
      }
      
      // Broadcast updated participants to all clients
      broadcastParticipants();
    });
  });
};

export default initializeSocket;

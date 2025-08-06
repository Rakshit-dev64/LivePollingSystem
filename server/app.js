import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 4000;
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin : "*"
    }
})

app.get("/",(req,res)=>{
    res.send("Welcome, server is running");
})
io.on("connection",(socket)=>{
    console.log(`User Connected ${socket.id}`);
})

server.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})
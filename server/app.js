import express from "express";
import { createServer } from "http";
import initializeSocket from "./src/socket.js";

const app = express();
const PORT = process.env.PORT || 4000;
const server = createServer(app);
initializeSocket(server);

app.get("/",(req,res)=>{
    res.send("Welcome, server is running");
})

server.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})
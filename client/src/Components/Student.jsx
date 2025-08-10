import { useEffect, useState } from "react";
import NameInputScreen from "./SubComponents/NameInputScreen";
import WaitingScreen from "./SubComponents/WaitingScreen";
import { createSocketConnection } from "../utils/socket";

const Student = () => {
  const socket = createSocketConnection();
  const confirmedName = sessionStorage.getItem("name");

  useEffect(()=>{
    if(confirmedName){
      socket.emit("student_registered",confirmedName)
    }
  },[confirmedName])


  if (!confirmedName) return <NameInputScreen />;
  return <WaitingScreen/>;
};

export default Student;

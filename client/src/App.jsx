import { useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'
import { createSocketConnection } from './utils/socket'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from './Components/Landing';
import Teacher from './Components/Teacher';
import Student from './Components/Student';

const App = () => {
  return (
    <div className='bg-[#F2F2F2] font-Manrope'>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/teacher' element={<Teacher/>}/>
        <Route path='/student' element={<Student/>}/>
      </Routes>
      
      </BrowserRouter>
    </div>
  )
}

export default App
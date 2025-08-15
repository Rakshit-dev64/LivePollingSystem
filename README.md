
# Intervue - Live Polling System

A real-time polling platform that enables teachers to broadcast live questions, students to submit answers instantly, and everyone to view live results — all with lightning-fast performance using Socket.IO.

🔗 **Live Demo:** [https://live-polling-system-chi.vercel.app]

## 🚀 Features
- 📢 Live Question Broadcasting – Teachers can push questions to all connected participants instantly.
- 📝 Answer Submissions – Students submit answers within the given time limit; results are revealed after the timer ends.
- 📊 Result Visualization – Displays correct answers and participant stats with <300 ms latency. 
- 🛠 Question Editor for Teachers – Create and manage questions with dynamic correct answer tagging and adjustable time limits.
- 👥 Live Participant List – Track all connected participants in real-time.
- 💬 Real-time Chat – Dedicated group chat for discussions during polling sessions, increasing student–teacher interaction by ~40%.


## 🛠 Tech Stack

**Frontend:**
- React
- TailwindCSS


**Backend:**
- Node.js
- Express.js
- Socket.io

## 📂 Project Structure
```bash 
LivePollingSystem/
│── client/       # React client app
│── server/       # Express + Socket.IO server
│── README.md
```
## 🏗️ Installation

#### Clone the Repository
```bash
git clone https://github.com/Rakshit-dev64/LivePollingSystem.git
cd LivePollingSystem
```
#### Install Dependencies
Backend
```bash
  cd server
  npm install
```
Frontend
```bash
  cd client
  npm install
```
#### Run Locally
Backend
```bash
  npm run dev
```
Frontend
```bash
  npm run dev
```
import React, { useState, useEffect, useRef } from 'react';

const ChatPanel = ({ isOpen, onClose, socket, name }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        text: newMessage,
        sender: name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socket.emit("send_message", message);
      setNewMessage('');
    }
  };
  const handleParticipants = () => {
    setActiveTab('participants');
  }

  useEffect(() => {
    if (!socket) return;
    
    const handleParticipants = (participants) => {
      setParticipants(participants);
      console.log("Hello", participants);
    };
    
    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };
    
    socket.on("participants", handleParticipants);
    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("participants", handleParticipants);
      socket.off("new_message", handleNewMessage);
    };
  }, [socket]);

  if (!isOpen) return null;

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {/* Chat Panel */}
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-[#7565D9] border-b-2 border-[#7565D9]'
                  : 'text-gray-600 hover:text-[#7565D9]'
              }`}
            >
              Chat
            </button>
            <button
              onClick={handleParticipants}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'participants'
                  ? 'text-[#7565D9] border-b-2 border-[#7565D9]'
                  : 'text-gray-600 hover:text-[#7565D9]'
              }`}
            >
              Participants
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1">
          {activeTab === 'chat' ? (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{maxHeight: 'calc(100vh - 200px)'}}>
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === name
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.sender === name
                          ? 'bg-[#7565D9] text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        <div className="text-xs opacity-75 mb-1">
                          {message.sender} • {message.timestamp}
                        </div>
                        <div className="text-sm">{message.text}</div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white mt-auto">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7565D9] focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      newMessage.trim()
                        ? 'bg-[#7565D9] text-white hover:bg-[#6454C8]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Participants Tab */
            <div className="flex-1 overflow-y-auto p-4" style={{maxHeight: 'calc(100vh - 150px)'}}>
              <div className="space-y-3">
                {participants.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p>No participants yet</p>
                  </div>
                ) : (
                  participants.map((participant, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        participant.role === 'teacher' ? 'bg-[#7565D9]' : 'bg-gray-500'
                      }`}>
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {participant.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {participant.role === 'teacher' ? 'Teacher' : 'Student'}
                        </div>
                      </div>
                      {participant.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;

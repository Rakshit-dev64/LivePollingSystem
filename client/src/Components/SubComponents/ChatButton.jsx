 import React from 'react';

const ChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-white border-2 border-[#7565D9] text-[#7565D9] font-semibold p-3 rounded-full hover:bg-[#7565D9] hover:text-white transition-all shadow-lg z-40"
      title="Open Chat"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1h.1c.3 0 .6-.1.8-.3L14.6 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12H7v-2h6v2zm3-4H7V8h9v2z"/>
      </svg>
    </button>
  );
};

export default ChatButton;

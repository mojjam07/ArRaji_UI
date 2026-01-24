import React, { useState, useRef } from 'react';
import Modal from './Modal';

export default function ChatbotTrigger() {
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleClick = () => {
    if (!isDragging) {
      setIsOpen(true);
    }
  };

  return (
    <>
      <div
        ref={dragRef}
        className="fixed z-50 cursor-pointer"
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <div className="bg-primary-900 text-white rounded-full p-4 shadow-lg hover:bg-accent-500 transition-colors">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="ArRaji Bot">
        <div className="p-4">
          <p className="text-neutral-600 mb-4">Welcome to the ArRaji Bot! This is a placeholder for the chat interface. Backend integration will be added later.</p>
          <div className="bg-primary-900 p-3 rounded-lg">
            <p className="text-sm text-accent-200">Chatbot: How can I help you today?</p>
          </div>
        </div>
      </Modal>
    </>
  );
}

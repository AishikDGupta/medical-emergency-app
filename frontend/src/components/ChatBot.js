import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './ChatBot.css';

export default function ChatBot() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [file, setFile] = useState(null);
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('userId', currentUser.uid);
      formData.append('message', message);
      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setChatHistory([...chatHistory, { 
        user: message, 
        bot: response.data.response, 
        file_url: response.data.file_url 
      }]);
      setMessage('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    } else {
      alert('Please select an image file');
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="chat-bot">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-message">
            <div className="user-message">
              <p>You: {chat.user}</p>
              {chat.file_url && chat.file_url.match(/\.(jpeg|jpg|gif|png)$/) && (
                <img src={chat.file_url} alt="User upload" className="user-image" />
              )}
            </div>
            <div className="bot-message">
              <p>MedBot: {chat.bot}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          ref={fileInputRef}
          className="file-input"
          id="file-input"
        />
        <label htmlFor="file-input" className="file-input-label">
          📎
        </label>
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}



import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

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
    setFile(e.target.files[0]);
  }

  return (
    <div className="chat-bot">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <p>You: {chat.user}</p>
            {chat.file_url && (
              <div>
                {chat.file_url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                  <img src={chat.file_url} alt="User upload" style={{ maxWidth: '200px' }} />
                ) : chat.file_url.match(/\.(mp3|wav|ogg)$/) ? (
                  <audio controls src={chat.file_url}>
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <a href={chat.file_url} target="_blank" rel="noopener noreferrer">View file</a>
                )}
              </div>
            )}
            <p>MedBot: {chat.bot}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,audio/*"
          ref={fileInputRef}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

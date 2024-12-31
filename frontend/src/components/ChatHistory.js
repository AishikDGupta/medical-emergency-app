import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function ChatHistory() {
  const [history, setHistory] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/history?userId=${currentUser.uid}`);
        setHistory(response.data.messages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    }
    fetchHistory();
  }, [currentUser]);

  return (
    <div className="chat-history">
      <h3>Chat History</h3>
      {history.map((chat, index) => (
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
  );
}

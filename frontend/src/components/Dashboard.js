import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChatBot from './ChatBot';
import ChatHistory from './ChatHistory';

export default function Dashboard() {
  const { logout } = useAuth();
  const [activeComponent, setActiveComponent] = useState('medbot-chat');

  async function handleLogout() {
    try {
      await logout();
    } catch {
      alert('Failed to log out');
    }
  }

  return (
    <div className="dashboard">
      <div className="left-sidebar">
        <button onClick={() => setActiveComponent('medbot-chat')}>MedBot Chat</button>
        <button onClick={() => setActiveComponent('connect-band')}>Connect with Band</button>
        <button onClick={() => setActiveComponent('emergency')}>Emergency</button>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <div className="main-content">
        {activeComponent === 'medbot-chat' && <ChatBot />}
        {activeComponent === 'connect-band' && <div>Connect with Band Component</div>}
        {activeComponent === 'emergency' && <div>Emergency Component</div>}
      </div>
      <div className="right-sidebar">
        <ChatHistory />
      </div>
    </div>
  );
}

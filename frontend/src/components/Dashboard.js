import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChatBot from './ChatBot';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {currentUser.email}</h1>
        <button onClick={handleLogout}>Log Out</button>
      </header>
      <main>
        <ChatBot />
      </main>
    </div>
  );
}



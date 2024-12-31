import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      history.push('/');
    } catch {
      alert('Failed to log in');
    }
  }

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

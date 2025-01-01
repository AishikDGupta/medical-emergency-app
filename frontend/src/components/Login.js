import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      history.push('/');
    } catch (error) {
      setError(isLogin ? 'Failed to log in' : 'Failed to create an account');
      console.error(error);
    }
  }

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <div>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
      </button>
    </div>
  );
}


import { useState } from 'react';
import api from '../api';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // OAuth2PasswordRequestForm expects form-urlencoded data
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await api.post('/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      onLoginSuccess(access_token);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '50px auto', 
      padding: '40px', 
      border: '1px solid #ddd', 
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      backgroundColor: 'white'
    }}>
      <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#333' }}>Freelancer Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#333' }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter username"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#333' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>
        {error && <div style={{ color: 'red', fontSize: '14px', padding: '10px', backgroundColor: '#fee', borderRadius: '4px' }}>{error}</div>}
        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            padding: '14px', 
            marginTop: '10px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '6px', fontSize: '14px', color: '#666' }}>
          <strong>Default credentials:</strong><br />
          Username: <code>123</code><br />
          Password: <code>123</code>
        </div>
      </form>
    </div>
  );
}


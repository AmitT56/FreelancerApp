import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingForm from './components/LandingForm';
import CalendarView from './components/CalendarView';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { isAuthenticated, login, loading } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const handleClientSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
  }

  if (showLogin && !isAuthenticated) {
    return (
      <div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <button onClick={() => setShowLogin(false)} style={{ marginBottom: '20px', padding: '8px 16px' }}>
            ← Back to Public View
          </button>
        </div>
        <Login onLoginSuccess={(token) => { login(token); setShowLogin(false); }} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  // Public view - clients can submit forms
  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 20, minHeight: '100vh'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
        <LandingForm onClientSubmitted={handleClientSubmitted} />
        <div style={{border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9'}}>
          <h3>Freelancer Access</h3>
          <p>Are you the freelancer? <a href="#" onClick={(e) => { e.preventDefault(); setShowLogin(true); }} style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}>Login here</a></p>
        </div>
      </div>
      <div>
        <CalendarView refreshTrigger={refreshTrigger} isPublic={true} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

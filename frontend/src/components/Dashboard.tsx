import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ClientList from './ClientList';
import CalendarView from './CalendarView';

export default function Dashboard() {
  const { logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
        <h1>Freelancer Dashboard - All Leads</h1>
        <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
          Logout
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 20 }}>
        <div>
          <ClientList refreshTrigger={refreshTrigger} />
        </div>
        <div>
          <CalendarView refreshTrigger={refreshTrigger} isPublic={false} />
        </div>
      </div>
    </div>
  );
}


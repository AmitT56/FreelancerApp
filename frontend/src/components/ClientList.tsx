import { useEffect, useState } from 'react';
import api from '../api';

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  created_at: string;
};

export default function ClientList({ refreshTrigger }: { refreshTrigger?: number }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await api.get('/clients/');
        setClients(res.data);
      } catch (err) {
        console.error('Failed to load clients:', err);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [refreshTrigger]);

  if (loading) {
    return <div>Loading clients...</div>;
  }

  return (
    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <h2>All Leads from Landing Page ({clients.length})</h2>
      {clients.length === 0 ? (
        <p>No leads yet. Leads submitted from the landing page will appear here.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {clients.map((client) => (
            <div
              key={client.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, color: '#333' }}>{client.name}</h3>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {new Date(client.created_at).toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                <div>
                  <strong>Email:</strong> <a href={`mailto:${client.email}`}>{client.email}</a>
                </div>
                {client.phone && (
                  <div>
                    <strong>Phone:</strong> <a href={`tel:${client.phone}`}>{client.phone}</a>
                  </div>
                )}
                {client.notes && (
                  <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
                    <strong>Notes:</strong> {client.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


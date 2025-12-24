import { useState } from 'react';
import api from '../api';

interface LandingFormProps {
  onClientSubmitted?: () => void;
}

export default function LandingForm({ onClientSubmitted }: LandingFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [requestedStart, setRequestedStart] = useState('');
  const [status, setStatus] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const payload: any = { name, email, phone, notes };
      if (requestedStart) payload.requested_start = new Date(requestedStart).toISOString();
      await api.post('/clients/', payload);
      setStatus('sent');
      setName(''); setEmail(''); setPhone(''); setNotes(''); setRequestedStart('');
      // Notify parent component to refresh client list and calendar
      if (onClientSubmitted) {
        onClientSubmitted();
      }
    } catch (err: any) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={submit} style={{maxWidth: 600}}>
      <h2>Leave your details</h2>
      <label>Name</label>
      <input value={name} onChange={e => setName(e.target.value)} required />
      <label>Email</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <label>Phone</label>
      <input value={phone} onChange={e => setPhone(e.target.value)} />
      <label>Preferred date/time (optional)</label>
      <input type="datetime-local" value={requestedStart} onChange={e => setRequestedStart(e.target.value)} />
      <label>Notes</label>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} />
      <button type="submit">Submit</button>
      <div>Status: {status}</div>
    </form>
  );
}
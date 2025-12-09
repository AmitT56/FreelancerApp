import LandingForm from './components/LandingForm';
import CalendarView from './components/CalendarView';

export default function App() {
  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 20, minHeight: '100vh'}}>
      <div>
        <LandingForm />
      </div>
      <div>
        <CalendarView />
      </div>
    </div>
  );
}
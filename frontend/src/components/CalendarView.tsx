import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../api';

export default function CalendarView() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const end = new Date(now.getFullYear(), now.getMonth() + 2, 1).toISOString();
        const res = await api.get('/events/', { params: { start, end } });
        setEvents(res.data.map((e: any) => ({ 
          id: String(e.id), 
          title: e.title, 
          start: e.start, 
          end: e.end 
        })));
      } catch (err) {
        console.error('Failed to load events:', err);
        // Set empty array on error to prevent crashes
        setEvents([]);
      }
    })();
  }, []);

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        height={600}
      />
    </div>
  );
}